import "server-only";
import { env } from "@/lib/env";
import { createStripeProvider } from "@/lib/payments/stripe";

/**
 * Payment provider architecture.
 *
 * "manual" (default, always available): the client pays using the details in
 * the quotation (bank transfer / mobile wallet), submits the transaction
 * reference, and the ADMIN verifies receipt before the payment is marked paid.
 * Nothing is ever marked paid automatically from the browser.
 *
 * Gateway providers (e.g. a Pakistani gateway once merchant approval is
 * granted) plug in by implementing `GatewayProvider` and registering below.
 * Their webhook must be verified server-side at /api/payments/webhook/[provider].
 * No gateway is registered yet — none is enabled without real credentials.
 */
export interface VerifiedWebhookEvent {
  paymentId: string;
  transactionReference: string;
  status: "paid" | "failed" | "refunded";
  amount: number;
  currency: string;
  raw: unknown;
}

export interface GatewayProvider {
  id: string;
  label: string;
  /** Create a hosted checkout session and return the URL to redirect the client to. */
  createCheckout(input: { paymentId: string; amount: number; currency: string; customerEmail: string; returnUrl: string }): Promise<{ url: string }>;
  /** Verify signature + payload of a webhook request. Must throw if invalid. */
  verifyWebhook(rawBody: string, headers: Headers): Promise<VerifiedWebhookEvent>;
}

const gateways: Record<string, GatewayProvider> = {
  // Only registered when real credentials exist. Add Pakistani gateways (e.g. Safepay) the same way.
  ...(env.paymentProvider === "stripe" && env.paymentSecretKey && env.paymentWebhookSecret
    ? { stripe: createStripeProvider(env.paymentSecretKey, env.paymentWebhookSecret) }
    : {}),
};

export function activeProviderId() {
  return env.paymentProvider || "manual";
}

/** The online gateway to use for new payments, or null → manual verification. */
export function activeGateway(): GatewayProvider | null {
  const id = activeProviderId();
  return id === "manual" ? null : getGateway(id);
}

export function getGateway(id: string): GatewayProvider | null {
  return gateways[id] ?? null;
}

export function paymentStatusSummary() {
  const id = activeProviderId();
  if (id === "manual") {
    return { id, configured: true, label: "Manual verification (bank transfer / wallet)", gateway: false };
  }
  const gw = getGateway(id);
  const hasKeys = Boolean(env.paymentSecretKey && env.paymentWebhookSecret);
  return {
    id,
    configured: Boolean(gw && hasKeys),
    label: gw ? gw.label : `"${id}" — no adapter implemented yet`,
    gateway: true,
  };
}
