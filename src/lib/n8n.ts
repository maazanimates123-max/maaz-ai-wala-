import "server-only";
import { env } from "@/lib/env";

export class WebhookError extends Error {
  constructor(
    message: string,
    public kind: "not_configured" | "timeout" | "network" | "http" | "invalid_response",
    public status?: number,
  ) {
    super(message);
  }
}

interface PostOptions {
  timeoutMs?: number;
}

/**
 * POSTs JSON to an n8n webhook. The URL lives only on the server.
 * If N8N_WEBHOOK_SECRET is set it is sent as the `X-Webhook-Secret` header,
 * so the n8n workflow can reject requests that did not come from this site
 * (configure Header Auth on the n8n Webhook node).
 */
export async function postToWebhook(url: string | undefined, payload: unknown, { timeoutMs = 25_000 }: PostOptions = {}) {
  if (!url) throw new WebhookError("Webhook URL is not configured", "not_configured");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain;q=0.9",
        ...(env.n8nWebhookSecret ? { "X-Webhook-Secret": env.n8nWebhookSecret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw new WebhookError("The automation server took too long to respond", "timeout");
    throw new WebhookError("Could not reach the automation server", "network");
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new WebhookError(`Automation server responded with HTTP ${res.status}`, "http", res.status);
  }
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // plain-text response is allowed
  }
  return { status: res.status, body, raw: text };
}

const REPLY_KEYS = ["reply", "output", "text", "response", "answer", "message", "content"] as const;

/**
 * Extracts the assistant reply from the different shapes an n8n workflow can
 * return: {reply}, {output} (AI Agent node), [{output}], {data:{reply}},
 * or a plain-text body. Returns null if no usable text is found.
 */
export function extractReply(body: unknown, depth = 0): string | null {
  if (depth > 4 || body === null || body === undefined) return null;
  if (typeof body === "string") {
    const t = body.trim();
    return t.length > 0 && t.length <= 10_000 ? t : null;
  }
  if (Array.isArray(body)) {
    for (const item of body) {
      const r = extractReply(item, depth + 1);
      if (r) return r;
    }
    return null;
  }
  if (typeof body === "object") {
    const obj = body as Record<string, unknown>;
    for (const key of REPLY_KEYS) {
      const v = obj[key];
      if (typeof v === "string" && v.trim()) return v.trim().slice(0, 10_000);
    }
    for (const key of ["data", "json", "result", "body"]) {
      if (key in obj) {
        const r = extractReply(obj[key], depth + 1);
        if (r) return r;
      }
    }
  }
  return null;
}
