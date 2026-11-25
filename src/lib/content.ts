import "server-only";
import { cache } from "react";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";
import {
  defaultPortfolio,
  defaultPricing,
  defaultServices,
  defaultSettings,
  type SiteSettings,
} from "@/lib/defaults";
import type { PortfolioProject, PricingPackage, Service, Testimonial } from "@/lib/types";

/**
 * Public content loaders. They use the anon key (RLS: only public rows are
 * readable) and never cookies, so marketing pages can be statically rendered
 * and revalidated. When a table is empty or the DB is unreachable, the
 * built-in defaults are shown so the site never renders blank.
 */
function publicClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabase(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const withIds = <T extends { slug: string }>(rows: T[]) => rows.map((r) => ({ id: `default-${r.slug}`, ...r }));

export const getServices = cache(async (): Promise<{ items: Service[]; source: "db" | "default" }> => {
  const db = publicClient();
  if (db) {
    const { data, error } = await db.from("services").select("*").eq("is_active", true).order("display_order");
    if (!error && data && data.length > 0) return { items: data as Service[], source: "db" };
  }
  return { items: withIds(defaultServices), source: "default" };
});

export const getService = cache(async (slug: string) => {
  const { items } = await getServices();
  return items.find((s) => s.slug === slug) ?? null;
});

export const getPortfolio = cache(async (): Promise<{ items: PortfolioProject[]; source: "db" | "default" }> => {
  const db = publicClient();
  if (db) {
    const { data, error } = await db
      .from("portfolio_projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order");
    if (!error && data && data.length > 0) return { items: data as PortfolioProject[], source: "db" };
  }
  return { items: withIds(defaultPortfolio), source: "default" };
});

export const getPricing = cache(async (): Promise<{ items: PricingPackage[]; source: "db" | "default" }> => {
  const db = publicClient();
  if (db) {
    const { data, error } = await db.from("pricing_packages").select("*").eq("is_active", true).order("display_order");
    if (!error && data && data.length > 0) {
      return {
        items: (data as PricingPackage[]).map((p) => ({ ...p, price: p.price === null ? null : Number(p.price) })),
        source: "db",
      };
    }
  }
  return { items: withIds(defaultPricing), source: "default" };
});

/** Only testimonials the owner has marked verified AND published (enforced by RLS too). Never defaults. */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const db = publicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("testimonials")
    .select("id, author_name, author_role, company, quote, rating, is_verified, is_published, display_order")
    .eq("is_published", true)
    .eq("is_verified", true)
    .order("display_order")
    .limit(12);
  return error || !data ? [] : (data as Testimonial[]);
});

export const getPortfolioItem = cache(async (slug: string) => {
  const { items } = await getPortfolio();
  return items.find((p) => p.slug === slug) ?? null;
});

/** Settings stored in the DB are merged over the defaults key-by-key. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const merged: SiteSettings = structuredClone(defaultSettings);
  const db = publicClient();
  if (!db) return merged;
  const { data, error } = await db.from("website_settings").select("key, value").eq("is_public", true);
  if (error || !data) return merged;
  for (const row of data) {
    const key = row.key as keyof SiteSettings;
    if (key in merged && row.value && typeof row.value === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (merged as any)[key] = { ...(merged as any)[key], ...(row.value as object) };
    }
  }
  return merged;
});
