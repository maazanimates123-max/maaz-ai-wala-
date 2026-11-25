import { NextResponse, after } from "next/server";
import { env, isEmailConfigured } from "@/lib/env";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { fieldErrors, passesTimingCheck, projectSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request";
import { randomUUID } from "node:crypto";
import { postToWebhook, WebhookError } from "@/lib/n8n";
import { emailLayout, escapeHtml, ownerRecipients, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Reads a hot/warm/cold label and an optional 0-100 score from the n8n response. */
function readQualification(body: unknown): { label: string | null; score: number | null; text: string | null } {
  const obj = (Array.isArray(body) ? body[0] : body) as Record<string, unknown> | null;
  if (!obj || typeof obj !== "object") return { label: null, score: null, text: null };
  const src = (obj.json && typeof obj.json === "object" ? obj.json : obj) as Record<string, unknown>;
  let label: string | null = null;
  for (const k of ["lead_status", "leadStatus", "temperature", "classification", "qualification", "category", "status", "lead"]) {
    const v = src[k];
    if (typeof v === "string" && /\b(hot|warm|cold)\b/i.test(v)) {
      label = v.match(/\b(hot|warm|cold)\b/i)![1].toLowerCase();
      break;
    }
  }
  const rawScore = src.score ?? src.lead_score ?? src.leadScore;
  const score = typeof rawScore === "number" || typeof rawScore === "string" ? Math.round(Number(rawScore)) : NaN;
  const textKey = ["reason", "summary", "analysis", "message"].find((k) => typeof src[k] === "string");
  return {
    label,
    score: Number.isFinite(score) && score >= 0 && score <= 100 ? score : null,
    text: textKey ? String(src[textKey]).slice(0, 4000) : null,
  };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return json({ error: "Forbidden" }, 403);

  const session = await getSession().catch(() => null);
  if (session?.isBlocked) return json({ error: "Your account is restricted. Please contact us." }, 403);

  const limit = rateLimit(`project:${session?.user.id ?? clientIp(request.headers)}`, 5, 60 * 60_000);
  if (!limit.ok) return json({ error: "You've submitted several projects recently. Please try again later." }, 429);

  const raw = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) }, 400);
  const { company_website, form_started_at, ...data } = parsed.data;
  if (company_website || !passesTimingCheck(form_started_at)) return json({ error: "Submission rejected. Please try again." }, 400);

  const db = createAdminClient();
  if (!db && !env.n8nProjectIntakeWebhookUrl) {
    return json({ error: "Project submissions are temporarily unavailable. Please use the contact form." }, 503);
  }

  // 1. Store the project (when the database is configured)
  let project: { id: string | null; reference: string; created_at: string } = {
    id: null,
    reference: `MAW-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    created_at: new Date().toISOString(),
  };
  let lead: { id: string } | null = null;
  if (db) {
    const { data: row, error } = await db
      .from("projects")
      .insert({ ...data, client_id: session?.user.id ?? null })
      .select("id, reference, created_at")
      .single();
    if (error || !row) {
      console.error("[projects] insert failed:", error?.message);
      return json({ error: "We couldn't save your project. Please try again." }, 500);
    }
    project = row;
    const res = await db
      .from("leads")
      .insert({
        source: "project_intake",
        full_name: data.full_name,
        email: data.email,
        business_name: data.business_name,
        service_interest: data.service_required,
        message: data.description.slice(0, 5000),
        project_id: project.id,
      })
      .select("id")
      .single();
    lead = res.data;
  }

  // 2. Forward to the n8n project-intake workflow (lead qualification + thank-you message)
  let intakeStatus: "forwarded" | "failed" | "not_configured" = "not_configured";
  let intakeResponse: unknown = null;
  if (env.n8nProjectIntakeWebhookUrl) {
    try {
      const result = await postToWebhook(
        env.n8nProjectIntakeWebhookUrl,
        {
          event: "project.submitted",
          source: "maaz-ai-wala-website",
          submittedAt: project.created_at,
          project: { id: project.id, reference: project.reference, ...data },
          // Flat copies of the key fields for easy use in n8n expressions
          name: data.full_name,
          email: data.email,
          service: data.service_required,
          budget: data.budget,
          timeline: data.timeline,
          ...(project.id ? { dashboardUrl: `${env.siteUrl}/admin/projects/${project.id}` } : {}),
        },
        { timeoutMs: 30_000 },
      );
      intakeStatus = "forwarded";
      intakeResponse = typeof result.body === "string" ? { text: result.body.slice(0, 4000) } : result.body;
      const q = readQualification(result.body);
      if (db && lead && (q.label || q.score !== null || q.text)) {
        await db
          .from("leads")
          .update({
            qualification: [q.label ? `Lead temperature: ${q.label.toUpperCase()}` : null, q.text].filter(Boolean).join("\n") || null,
            score: q.score,
            status: q.label === "hot" || q.label === "warm" ? "qualified" : q.label === "cold" ? "new" : undefined,
          })
          .eq("id", lead.id);
      }
    } catch (err) {
      intakeStatus = "failed";
      if (!db) return json({ error: "We couldn't send your project right now. Please try again or use the contact form." }, 502);
      intakeResponse = { error: err instanceof WebhookError ? `${err.kind}: ${err.message}` : String(err) };
      console.error("[projects] intake webhook failed:", (err as Error).message);
    }
  }

  // 3. Client confirmation email
  let confirmation: "sent" | "failed" | "not_configured" | "delegated_to_n8n" = "not_configured";
  if (env.clientConfirmationVia === "n8n") {
    confirmation = intakeStatus === "forwarded" ? "delegated_to_n8n" : intakeStatus === "failed" ? "failed" : "not_configured";
  } else if (isEmailConfigured) {
    const r = await sendEmail({
      to: data.email,
      subject: `We received your project — ${project.reference}`,
      text: `Hi ${data.full_name},\n\nThank you for sharing your project with Maaz AI Wala. Your reference is ${project.reference}. We will review your requirements and get back to you.\n\n\nMaaz AI Wala`,
      html: emailLayout(
        "We received your project",
        `<p style="color:#cfcfcf;line-height:1.6">Hi ${escapeHtml(data.full_name)},</p>
         <p style="color:#cfcfcf;line-height:1.6">Thank you for sharing your project with Maaz AI Wala. We will review your requirements and get back to you.</p>
         <p style="color:#cfcfcf">Reference: <strong style="color:#a78bfa">${project.reference}</strong></p>`,
      ),
    });
    confirmation = r.status;
  }

  // 4. Owner notification email (in addition to any n8n notification)
  const owners = ownerRecipients();
  if (isEmailConfigured && owners.length) {
    after(() => sendEmail({
      to: owners,
      replyTo: data.email,
      subject: `New project: ${data.business_name} (${data.service_required})`,
      text: `New project ${project.reference} from ${data.full_name} <${data.email}>.\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\n${data.description}\n\n${project.id ? `${env.siteUrl}/admin/projects/${project.id}` : ""}`,
      html: emailLayout(
        "New project submission",
        `<p style="color:#cfcfcf">${escapeHtml(data.full_name)} &lt;${escapeHtml(data.email)}&gt; — ${escapeHtml(data.business_name)}</p>
         <p style="color:#cfcfcf">Service: ${escapeHtml(data.service_required)}<br>Budget: ${escapeHtml(data.budget)}<br>Timeline: ${escapeHtml(data.timeline)}</p>
         <p style="color:#cfcfcf;white-space:pre-wrap">${escapeHtml(data.description)}</p>
         ${project.id ? `<p><a href="${env.siteUrl}/admin/projects/${project.id}" style="color:#a78bfa">Open in admin dashboard</a></p>` : ""}`,
      ),
    }));
  }

  if (db && project.id) {
    await db.from("projects").update({ intake_status: intakeStatus, intake_response: intakeResponse, confirmation_email_status: confirmation }).eq("id", project.id);
    if (session) {
      await db.from("notifications").insert({ user_id: session.user.id, title: "Project submitted", body: `We received ${project.reference}.`, link: `/dashboard/projects/${project.id}` });
    }
  }

  return json({ ok: true, id: project.id, reference: project.reference, intake: intakeStatus, confirmation }, 201);
}
