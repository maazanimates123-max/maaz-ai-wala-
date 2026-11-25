import { NextResponse, after } from "next/server";
import { env, isEmailConfigured } from "@/lib/env";
import { postToWebhook, WebhookError } from "@/lib/n8n";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema, fieldErrors, passesTimingCheck } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request";
import { emailLayout, escapeHtml, ownerRecipients, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return json({ error: "Forbidden" }, 403);
  const limit = rateLimit(`contact:${clientIp(request.headers)}`, 5, 10 * 60_000);
  if (!limit.ok) return json({ error: "Too many messages. Please try again in a few minutes." }, 429);

  const raw = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return json({ error: "Please fix the highlighted fields.", fields: fieldErrors(parsed.error) }, 400);
  const { company_website, form_started_at, ...data } = parsed.data;
  if (company_website || !passesTimingCheck(form_started_at)) return json({ error: "Submission rejected. Please try again." }, 400);

  const db = createAdminClient();
  if (!db && !env.n8nContactWebhookUrl) {
    return json({ error: "The contact form is temporarily unavailable. Please reach us on social media." }, 503);
  }

  // 1. Save to the database (when configured)
  let messageId: string | null = null;
  if (db) {
    const session = await getSession().catch(() => null);
    const { data: msg, error } = await db
      .from("contact_messages")
      .insert({ ...data, user_id: session?.user.id ?? null })
      .select("id")
      .single();
    if (error || !msg) {
      console.error("[contact] insert failed:", error?.message);
      return json({ error: "We couldn't send your message. Please try again." }, 500);
    }
    messageId = msg.id;
    await db.from("leads").insert({
      source: "contact",
      full_name: data.full_name,
      email: data.email,
      service_interest: data.service_interest ?? null,
      message: `${data.subject}\n\n${data.message}`.slice(0, 5000),
      contact_message_id: msg.id,
    });
  }

  // 2. Forward to the n8n contact workflow (N8N_CONTACT_WEBHOOK_URL)
  let forwarded: "forwarded" | "failed" | "not_configured" = "not_configured";
  if (env.n8nContactWebhookUrl) {
    try {
      await postToWebhook(
        env.n8nContactWebhookUrl,
        {
          event: "contact.submitted",
          source: "maaz-ai-wala-website",
          submittedAt: new Date().toISOString(),
          id: messageId,
          name: data.full_name,
          email: data.email,
          subject: data.subject,
          service: data.service_interest ?? null,
          budget: data.budget ?? null,
          phone: data.phone ?? null,
          message: data.message,
        },
        { timeoutMs: 20_000 },
      );
      forwarded = "forwarded";
    } catch (err) {
      forwarded = "failed";
      console.error("[contact] n8n webhook failed:", err instanceof WebhookError ? `${err.kind}: ${err.message}` : err);
      // Without a database the webhook is the only record — so report the failure honestly.
      if (!db) return json({ error: "We couldn't send your message right now. Please try again or reach us on WhatsApp." }, 502);
    }
  }

  const owners = ownerRecipients();
  if (isEmailConfigured && owners.length) {
    after(() => sendEmail({
      to: owners,
      replyTo: data.email,
      subject: `Contact: ${data.subject}`,
      text: `${data.full_name} <${data.email}> ${data.phone ?? ""}\nService: ${data.service_interest ?? "-"}\nBudget: ${data.budget ?? "-"}\n\n${data.message}`,
      html: emailLayout(
        "New contact inquiry",
        `<p style="color:#cfcfcf">${escapeHtml(data.full_name)} &lt;${escapeHtml(data.email)}&gt; ${escapeHtml(data.phone ?? "")}</p>
         <p style="color:#cfcfcf">Service: ${escapeHtml(data.service_interest ?? "—")}<br>Budget: ${escapeHtml(data.budget ?? "—")}</p>
         <p style="color:#cfcfcf;white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
      ),
    }));
  }
  // Customer confirmation (only reported as sent by the provider's response, never assumed).
  let confirmation: "sent" | "failed" | "not_configured" = "not_configured";
  if (isEmailConfigured) {
    const r = await sendEmail({
      to: data.email,
      subject: "We received your message — Maaz AI Wala",
      text: `Hi ${data.full_name},\n\nThanks for contacting Maaz AI Wala. We received your message "${data.subject}" and will reply soon.\n\nMaaz AI Wala`,
      html: emailLayout(
        "We received your message",
        `<p style="color:#cfcfcf;line-height:1.6">Hi ${escapeHtml(data.full_name)},</p>
         <p style="color:#cfcfcf;line-height:1.6">Thanks for contacting Maaz AI Wala. We received your message <strong style="color:#fff">“${escapeHtml(data.subject)}”</strong> and will reply soon.</p>`,
      ),
    });
    confirmation = r.status;
  }
  return json({ ok: true, confirmation, forwarded }, 201);
}
