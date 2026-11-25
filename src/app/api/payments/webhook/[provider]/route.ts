import { NextResponse } from "next/server";
import { getGateway } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-to-server payment confirmation from a gateway. The ONLY way a payment
 * becomes "paid" automatically is a webhook whose signature the provider
 * adapter verifies. No adapter is registered until real credentials exist.
 */
export async function POST(request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const gateway = getGateway(provider);
  if (!gateway) return NextResponse.json({ error: "Unknown or unconfigured payment provider" }, { status: 404 });

  const raw = await request.text();
  let event;
  try {
    event = await gateway.verifyWebhook(raw, request.headers);
  } catch (err) {
    // Signed but irrelevant event types are acknowledged so the provider stops retrying.
    if ((err as Error).message.startsWith("Ignored")) return NextResponse.json({ received: true, ignored: true });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = createAdminClient();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { data: payment } = await db.from("payments").select("id, amount, currency, project_id, status").eq("id", event.paymentId).eq("provider", provider).maybeSingle();
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  if (Number(payment.amount) !== event.amount || payment.currency !== event.currency) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }
  if (payment.status !== "paid" || event.status !== "paid") {
    await db
      .from("payments")
      .update({
        status: event.status,
        transaction_reference: event.transactionReference,
        provider_payload: event.raw as object,
        ...(event.status === "paid" ? { verified_at: new Date().toISOString() } : {}),
      })
      .eq("id", payment.id);
    if (event.status === "paid") {
      await db.from("projects").update({ status: "in_progress" }).eq("id", payment.project_id).eq("status", "awaiting_payment");
    }
  }
  return NextResponse.json({ received: true });
}
