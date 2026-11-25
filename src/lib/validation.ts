import { z } from "zod";

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const httpsUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a valid URL starting with https://");

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .transform((v) => (v ? (/^https?:\/\//i.test(v) ? v : `https://${v}`) : undefined))
  .refine((v) => {
    if (!v) return true;
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  }, "Enter a valid website address");

export const INDUSTRIES = [
  "E-commerce",
  "Real Estate",
  "Agency / Marketing",
  "Healthcare",
  "Education",
  "Professional Services",
  "Retail",
  "Restaurant / Food",
  "Technology / SaaS",
  "Content Creation",
  "Other",
] as const;

export const BUDGETS = [
  "Under $500",
  "$500 – $2,000",
  "$2,000 – $5,000",
  "Above $5,000",
  "Not sure yet",
] as const;

export const TIMELINES = ["As soon as possible", "Within 2 weeks", "Within 1 month", "1–3 months", "Flexible"] as const;

/** Anti-spam fields shared by public forms. */
const spamFields = {
  // Honeypot: real users never see or fill this field.
  company_website: z.string().max(0, "Spam detected").optional(),
  // Timestamp (ms) when the form was rendered; bots submit instantly.
  form_started_at: z.coerce.number().int().positive(),
};

export const projectSchema = z.object({
  full_name: trimmed(2, 120, "Full name"),
  email: z.email("Enter a valid email address").max(254),
  business_name: trimmed(2, 160, "Business name"),
  business_website: optionalUrl,
  industry: z.enum(INDUSTRIES, { error: "Select an industry" }),
  service_required: trimmed(2, 120, "Service"),
  description: trimmed(20, 5000, "Project description"),
  current_problem: trimmed(10, 5000, "Current business problem"),
  desired_automation: trimmed(10, 5000, "Desired automation"),
  budget: z.enum(BUDGETS, { error: "Select a budget range" }),
  timeline: z.enum(TIMELINES, { error: "Select a timeline" }),
  existing_tools: optionalText(2000, "Existing tools"),
  additional_requirements: optionalText(5000, "Additional requirements"),
  ...spamFields,
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const contactSchema = z.object({
  full_name: trimmed(2, 120, "Full name"),
  email: z.email("Enter a valid email address").max(254),
  subject: trimmed(2, 200, "Subject"),
  message: trimmed(10, 5000, "Message"),
  service_interest: optionalText(120, "Service"),
  budget: z.union([z.enum(BUDGETS), z.literal("")]).optional().transform((v) => v || undefined),
  phone: z.string().trim().max(40).regex(/^[\d+()\-\s]*$/, "Enter a valid phone number").optional().transform((v) => v || undefined),
  ...spamFields,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const chatSchema = z.object({
  message: trimmed(1, 2000, "Message"),
  sessionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{8,100}$/, "Invalid session id"),
  page: z.string().trim().max(300).regex(/^\//, "Invalid page").default("/"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(10)
    .default([]),
});

/** Converts zod issues to a { field: message } map for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Spam timing check: forms submitted in under 3 seconds or older than 1 day are rejected. */
export function passesTimingCheck(startedAt: number) {
  const age = Date.now() - startedAt;
  return age >= 3000 && age <= 24 * 60 * 60 * 1000;
}

/** Splits a textarea of one-item-per-line into a clean array. */
export function lines(value: FormDataEntryValue | null, maxItems = 20, maxLen = 200): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((s) => s.slice(0, maxLen));
}
