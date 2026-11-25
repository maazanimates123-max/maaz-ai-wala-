import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { GatewayProvider, VerifiedWebhookEvent } from "@/lib/payments";

/**
 * Stripe Checkout adapter (REST API, no SDK).
 * NOTE: Stripe does not currently onboard businesses registered in Pakistan.
 * Use it only if you have a Stripe account in a supported country (e.g. via a
 * US/UK company). Otherwise keep PAYMENT_PROVIDER=manual.
 */
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "CLP", "XOF", "XAF", "UGX", "RWF", "PYG", "MGA", "KMF", "GNF", "DJF", "BIF", "VUV", "XPF"]);
const toMinor = (amount: number, cur: string) => Math.round(ZERO_DECIMAL.has(cur) ? amount : amount * 100);
const fromMinor = (amount: number, cur: string) => (ZERO_DECIMAL.has(cur) ? amount : amount / 100);

export function createStripeProvider(secretKey: string, webhookSecret: string): GatewayProvider {
  return {
    id: "stripe",
    label: "Stripe Checkout",
    async createCheckout({ paymentId, amount, currency, customerEmail, returnUrl }) {
      const cur = currency.toUpperCase();
      const body = new URLSearchParams({
        mode: "payment",
        success_url: `${returnUrl}?payment=success`,
        cancel_url: `${returnUrl}?payment=cancelled`,
        customer_email: customerEmail,
        client_reference_id: paymentId,
        "metadata[payment_id]": paymentId,
        "payment_intent_data[metadata][payment_id]": paymentId,
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": cur.toLowerCase(),
        "line_items[0][price_data][unit_amount]": String(toMinor(amount, cur)),
        "line_items[0][price_data][product_data][name]": "Maaz AI Wala — automation project",
      });
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await res.json()) as { url?: string; error?: { message?: string } };
      if (!res.ok || !data.url) throw new Error(data.error?.message ?? `Stripe error ${res.status}`);
      return { url: data.url };
    },
    async verifyWebhook(rawBody, headers): Promise<VerifiedWebhookEvent> {
      const sig = headers.get("stripe-signature") ?? "";
      const parts = Object.fromEntries(sig.split(",").map((p) => p.split("=") as [string, string]));
      const t = Number(parts.t);
      const v1 = parts.v1;
      if (!t || !v1) throw new Error("Missing signature");
      if (Math.abs(Date.now() / 1000 - t) > 300) throw new Error("Signature too old");
      const expected = createHmac("sha256", webhookSecret).update(`${t}.${rawBody}`).digest("hex");
      if (expected.length !== v1.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) throw new Error("Bad signature");
      const event = JSON.parse(rawBody) as {
        type: string;
        data: { object: { metadata?: { payment_id?: string }; amount_total?: number; currency?: string; payment_intent?: string; payment_status?: string; id: string } };
      };
      const obj = event.data.object;
      if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_failed") throw new Error(`Ignored event ${event.type}`);
      const cur = (obj.currency ?? "").toUpperCase();
      return {
        paymentId: obj.metadata?.payment_id ?? "",
        transactionReference: obj.payment_intent ?? obj.id,
        status: event.type === "checkout.session.completed" && obj.payment_status === "paid" ? "paid" : "failed",
        amount: fromMinor(obj.amount_total ?? 0, cur),
        currency: cur,
        raw: { id: obj.id, type: event.type },
      };
    },
  };
}
