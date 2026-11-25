"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Browser client — uses only the public anon key. Used for starting sign-in flows. */
export function createBrowserSupabase(url: string, anonKey: string) {
  return createBrowserClient(url, anonKey);
}
