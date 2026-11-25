import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: string | Date | null | undefined, withTime = false) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatMoney(amount: number | string | null | undefined, currency = "PKR") {
  if (amount === null || amount === undefined || amount === "") return null;
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return null;
  try {
    return new Intl.NumberFormat(currency === "PKR" ? "en-PK" : "en-US", { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

export function humanize(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Only allow same-site relative redirect targets (prevents open redirects). */
export function safeNextPath(next: string | null | undefined, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/** wa.me click-to-chat link from a phone number in any format ("" if not set). */
export function whatsappLink(raw: string | undefined, text = "Hi Maaz AI Wala, I'd like to discuss an automation project.") {
  const digits = (raw ?? "").replace(/[^\d]/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : "";
}
