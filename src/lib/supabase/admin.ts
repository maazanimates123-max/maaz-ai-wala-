import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, isServiceRoleConfigured } from "@/lib/env";

/**
 * Service-role client. BYPASSES Row Level Security.
 * Only call it after the server has verified who the caller is and what they
 * are allowed to do (see lib/auth.ts). Never expose it to the browser.
 */
export function createAdminClient() {
  if (!isServiceRoleConfigured) return null;
  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
