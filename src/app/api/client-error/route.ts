import { NextResponse } from "next/server";
import { z } from "zod";
import { reportError } from "@/lib/monitoring";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin } from "@/lib/request";

export const runtime = "nodejs";

const schema = z.object({ message: z.string().max(1000), digest: z.string().max(100).optional(), path: z.string().max(300) });

/** Receives errors caught by the browser error boundary. */
export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return new NextResponse(null, { status: 403 });
  if (!rateLimit(`clienterr:${clientIp(request.headers)}`, 10, 60_000).ok) return new NextResponse(null, { status: 429 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (parsed.success) await reportError("client", { ...parsed.data, userAgent: request.headers.get("user-agent")?.slice(0, 200) });
  return new NextResponse(null, { status: 204 });
}
