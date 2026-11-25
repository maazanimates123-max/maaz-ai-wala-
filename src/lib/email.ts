import "server-only";
import { env, isEmailConfigured } from "@/lib/env";

/**
 * Transactional email via Resend (https://resend.com) REST API.
 * Uses EMAIL_PROVIDER_API_KEY and EMAIL_FROM. A message only counts as "sent"
 * when the provider returns a success response with a message id.
 */
export type EmailResult = { status: "sent"; id: string } | { status: "not_configured" } | { status: "failed"; error: string };

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string /* base64 */ }[];
}): Promise<EmailResult> {
  if (!isEmailConfigured) return { status: "not_configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.emailApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.emailFrom,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (res.ok && data.id) return { status: "sent", id: data.id };
    return { status: "failed", error: data.message ?? `HTTP ${res.status}` };
  } catch (err) {
    return { status: "failed", error: (err as Error).message };
  }
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Minimal branded email layout (inline styles for email client support). */
export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#e5e5e5">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:12px">
  <tr><td style="padding:24px 28px;border-bottom:1px solid #1f1f1f;font-weight:bold;letter-spacing:2px;color:#a78bfa">MAAZ AI WALA</td></tr>
  <tr><td style="padding:28px"><h1 style="margin:0 0 16px;font-size:20px;color:#ffffff">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
  <tr><td style="padding:18px 28px;border-top:1px solid #1f1f1f;font-size:12px;color:#8a8a8a">Automate. Create. Grow.</td></tr>
  </table></td></tr></table></body></html>`;
}

/** Owner recipients: OWNER_NOTIFICATION_EMAIL, falling back to ADMIN_EMAIL. */
export function ownerRecipients(): string[] {
  if (env.ownerNotificationEmail) return env.ownerNotificationEmail.split(",").map((s) => s.trim()).filter(Boolean);
  return env.adminEmails;
}
