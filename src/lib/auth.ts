import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/env";

/**
 * Roles
 *   owner   — email listed in ADMIN_EMAIL (server env). Full access incl. team & roles.
 *   manager — added by the owner in Admin → Team. Everything except team management.
 *   support — added by the owner. Leads, inbox, support, bookings (read + respond), no deletes/pricing/content.
 * Roles are stored server-side only; no user can grant themselves a role.
 */
export type Role = "owner" | "manager" | "support";
const RANK: Record<Role, number> = { support: 1, manager: 2, owner: 3 };

export interface SessionInfo {
  user: User;
  role: Role | null;
  isAdmin: boolean;
  isBlocked: boolean;
}

/** Returns the verified current user (validated against Supabase Auth), or null. */
export const getSession = cache(async (): Promise<SessionInfo | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const user = data.user;
  const verified = Boolean(user.email_confirmed_at) && Boolean(user.email);

  const { data: profile } = await supabase.from("profiles").select("is_blocked").eq("id", user.id).maybeSingle();

  let role: Role | null = null;
  if (verified && isAdminEmail(user.email)) role = "owner";
  else if (verified) {
    const admin = createAdminClient();
    if (admin) {
      const { data: staff } = await admin.from("staff_roles").select("role").eq("email", user.email!.toLowerCase()).maybeSingle();
      if (staff?.role === "manager" || staff?.role === "support") role = staff.role;
    }
  }
  const isBlocked = Boolean(profile?.is_blocked);
  return { user, role: isBlocked ? null : role, isAdmin: !isBlocked && role !== null, isBlocked };
});

export function hasRole(session: SessionInfo | null, min: Role) {
  return Boolean(session?.role && RANK[session.role] >= RANK[min]);
}

export async function requireUser(nextPath: string): Promise<SessionInfo> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (session.isBlocked) redirect("/login?error=blocked");
  return session;
}

/** Guard for admin pages. `min` = lowest role allowed (default: support can view the dashboard). */
export async function requireAdmin(min: Role = "support") {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (!hasRole(session, min)) redirect(session.isAdmin ? "/admin?error=permission" : "/dashboard?error=forbidden");
  const db = createAdminClient();
  return { session, db };
}

/**
 * Guard for server actions: throws instead of redirecting.
 * Default minimum role is "manager" — pass "support" for actions support staff may perform.
 * Returns a `log` helper that writes to the admin activity log.
 */
export async function assertAdmin(min: Role = "manager") {
  const session = await getSession();
  if (!hasRole(session, min)) throw new Error("You don't have permission to do that.");
  const db = createAdminClient();
  if (!db) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured on the server.");
  const log = async (action: string, entity?: string, entityId?: string, details?: Record<string, unknown>) => {
    await db.from("activity_logs").insert({
      actor_email: session!.user.email ?? "unknown",
      action,
      entity: entity ?? null,
      entity_id: entityId ?? null,
      details: details ?? null,
    });
  };
  return { session: session!, db, log };
}
