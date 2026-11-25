"use client";
import { useState } from "react";

export type FormState = { status: "idle" | "submitting" | "success" | "error"; error?: string; fields: Record<string, string> };

/** Submits a form as JSON to an API route and tracks loading / error / field errors. */
export function useJsonForm<T = unknown>(endpoint: string) {
  const [state, setState] = useState<FormState>({ status: "idle", fields: {} });
  const [result, setResult] = useState<T | null>(null);

  async function submit(payload: Record<string, unknown>) {
    setState({ status: "submitting", fields: {} });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ status: "error", error: data.error ?? `Something went wrong (HTTP ${res.status}).`, fields: data.fields ?? {} });
        return false;
      }
      setResult(data as T);
      setState({ status: "success", fields: {} });
      return true;
    } catch {
      setState({ status: "error", error: "Network error. Please check your connection and try again.", fields: {} });
      return false;
    }
  }
  return { state, result, submit, reset: () => setState({ status: "idle", fields: {} }) };
}

export function formToObject(form: HTMLFormElement) {
  const fd = new FormData(form);
  const obj: Record<string, string> = {};
  fd.forEach((v, k) => (obj[k] = typeof v === "string" ? v : ""));
  return obj;
}
