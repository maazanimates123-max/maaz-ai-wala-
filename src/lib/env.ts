import "server-only";

/**
 * Central place for reading server-side configuration.
 * Never import this file from a Client Component.
 */
function read(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export const env = {
  siteUrl: (read("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000").replace(/\/$/, ""),
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  adminEmails: (read("ADMIN_EMAIL") ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  n8nChatWebhookUrl: read("N8N_CHAT_WEBHOOK_URL"),
  n8nProjectIntakeWebhookUrl: read("N8N_PROJECT_INTAKE_WEBHOOK_URL"),
  n8nContactWebhookUrl: read("N8N_CONTACT_WEBHOOK_URL"),
  n8nWebhookSecret: read("N8N_WEBHOOK_SECRET"),
  emailApiKey: read("EMAIL_PROVIDER_API_KEY"),
  emailFrom: read("EMAIL_FROM"),
  ownerNotificationEmail: read("OWNER_NOTIFICATION_EMAIL"),
  // Who sends the client "thank you" confirmation: the n8n intake workflow (default) or this app via the email provider.
  clientConfirmationVia: (read("CLIENT_CONFIRMATION_VIA") ?? "n8n").toLowerCase() === "app" ? "app" : "n8n",
  paymentProvider: (read("PAYMENT_PROVIDER") ?? "manual").toLowerCase(),
  paymentPublicKey: read("PAYMENT_PROVIDER_PUBLIC_KEY"),
  paymentSecretKey: read("PAYMENT_PROVIDER_SECRET_KEY"),
  paymentWebhookSecret: read("PAYMENT_WEBHOOK_SECRET"),
  ipHashSalt: read("IP_HASH_SALT") ?? "maaz-ai-wala",
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isServiceRoleConfigured = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
export const isEmailConfigured = Boolean(env.emailApiKey && env.emailFrom);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return env.adminEmails.includes(email.toLowerCase());
}
