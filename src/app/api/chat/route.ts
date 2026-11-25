import { NextResponse, after } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { chatSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request";
import { extractReply, postToWebhook, WebhookError } from "@/lib/n8n";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/**
 * Secure proxy between the website chat widget and the n8n chatbot workflow.
 * The n8n URL stays on the server (N8N_CHAT_WEBHOOK_URL).
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return json({ error: "Forbidden" }, 403);

  const ip = clientIp(request.headers);
  const ipLimit = rateLimit(`chat:ip:${ip}`, 20, 60_000);
  if (!ipLimit.ok) {
    return json({ error: "You're sending messages too quickly. Please wait a moment." }, 429, { "Retry-After": String(ipLimit.retryAfter) });
  }

  const raw = await request.json().catch(() => null);
  const parsed = chatSchema.safeParse(raw);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Invalid message" }, 400);
  const { message, sessionId, page, history } = parsed.data;

  const sessLimit = rateLimit(`chat:session:${sessionId}`, 60, 10 * 60_000);
  if (!sessLimit.ok) return json({ error: "Message limit reached for this conversation. Please try again later." }, 429);

  if (!env.n8nChatWebhookUrl) {
    return json({ error: "The assistant is not available right now. Please use the contact form and we'll reply soon." }, 503);
  }

  let reply: string | null = null;
  let failure: string | null = null;
  try {
    const result = await postToWebhook(
      env.n8nChatWebhookUrl,
      { message, sessionId, source: "maaz-ai-wala-website", page, history },
      { timeoutMs: 45_000 },
    );
    reply = extractReply(result.body);
    if (!reply) failure = "invalid_response";
    // Optional: the n8n agent can return {"lead": {"name","email","service","budget","notes"}} when it has collected details.
    const lead = parseLead(result.body);
    if (lead) after(() => saveChatLead(lead, sessionId));
  } catch (err) {
    failure = err instanceof WebhookError ? err.kind : "network";
    console.error("[chat] webhook error:", err instanceof Error ? err.message : err);
  }

  // Store the conversation (best effort — never blocks the reply).
  after(() => persist(sessionId, page, message, reply ?? `[${failure}]`, reply ? "assistant" : "error"));

  if (!reply) {
    const msg =
      failure === "timeout"
        ? "The assistant is taking too long to respond. Please try again."
        : "The assistant is temporarily unavailable. You can try again or contact us directly.";
    return json({ error: msg }, failure === "timeout" ? 504 : 502);
  }
  return json({ reply });
}

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(3000).optional(),
});

function parseLead(body: unknown) {
  const obj = (Array.isArray(body) ? body[0] : body) as Record<string, unknown> | null;
  if (!obj || typeof obj !== "object" || !obj.lead) return null;
  const r = leadSchema.safeParse(obj.lead);
  return r.success ? r.data : null;
}

async function saveChatLead(lead: z.infer<typeof leadSchema>, sessionId: string) {
  const db = createAdminClient();
  if (!db) return;
  // One chatbot lead per conversation + email.
  const { data: existing } = await db.from("leads").select("id").eq("source", "chatbot").eq("email", lead.email).ilike("message", `%${sessionId}%`).maybeSingle();
  if (existing) return;
  await db.from("leads").insert({
    source: "chatbot",
    full_name: lead.name,
    email: lead.email,
    service_interest: lead.service ?? null,
    message: `${lead.notes ?? "Captured by the website assistant."}${lead.budget ? `\nBudget: ${lead.budget}` : ""}\n[chat session ${sessionId}]`.slice(0, 5000),
  });
}

async function persist(sessionId: string, page: string, userText: string, replyText: string, role: "assistant" | "error") {
  try {
    const db = createAdminClient();
    if (!db) return;
    const session = await getSession().catch(() => null);
    const { data: conv } = await db
      .from("conversations")
      .upsert(
        { session_id: sessionId, first_page: page, last_message_at: new Date().toISOString(), ...(session ? { user_id: session.user.id } : {}) },
        { onConflict: "session_id", ignoreDuplicates: false },
      )
      .select("id")
      .single();
    if (!conv) return;
    await db.from("chat_messages").insert([
      { conversation_id: conv.id, role: "user", content: userText, page },
      { conversation_id: conv.id, role, content: replyText.slice(0, 10_000), page },
    ]);
  } catch (err) {
    console.error("[chat] persist failed:", (err as Error).message);
  }
}
