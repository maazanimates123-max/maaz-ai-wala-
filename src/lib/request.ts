import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export function hashIp(ip: string) {
  return createHash("sha256").update(`${env.ipHashSalt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * CSRF defence for JSON route handlers: browsers always send Origin on
 * cross-site POSTs, so reject requests whose Origin does not match our host.
 */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return false;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
