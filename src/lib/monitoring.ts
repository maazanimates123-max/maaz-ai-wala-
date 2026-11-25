import "server-only";

/**
 * Lightweight error monitoring. Errors are always logged (visible in Vercel → Logs).
 * If ERROR_WEBHOOK_URL is set (e.g. an n8n webhook that posts to Slack/Telegram/email),
 * a compact JSON report is POSTed there as well.
 */
export async function reportError(source: "server" | "client", payload: Record<string, unknown>) {
  const report = { app: "maaz-ai-wala", source, at: new Date().toISOString(), env: process.env.VERCEL_ENV ?? process.env.NODE_ENV, ...payload };
  console.error("[error-report]", JSON.stringify(report).slice(0, 4000));
  const url = process.env.ERROR_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report), signal: AbortSignal.timeout(5000) });
  } catch {
    /* never throw from the error reporter */
  }
}
