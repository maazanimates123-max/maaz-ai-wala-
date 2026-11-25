"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Rocket } from "lucide-react";
import { Alert, Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button, ButtonLink } from "@/components/ui/button";
import { SpamGuard } from "@/components/forms/honeypot";
import { formToObject, useJsonForm } from "@/components/forms/use-json-form";
import { BUDGETS, INDUSTRIES, TIMELINES } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Result = { id: string | null; reference: string; intake: string; confirmation: string };

const STEP_FIELDS: string[][] = [
  ["full_name", "email", "business_name", "business_website", "industry"],
  ["service_required", "description", "current_problem", "desired_automation"],
  ["budget", "timeline", "existing_tools", "additional_requirements"],
];
const STEP_TITLES = ["About you", "Your project", "Scope & details"];

export function ProjectForm({ services, defaults }: { services: string[]; defaults: { full_name?: string; email?: string; service?: string; industry?: string; notes?: string } }) {
  const { state, result, submit } = useJsonForm<Result>("/api/projects");
  const [step, setStep] = useState(0);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const errors = { ...localErrors, ...state.fields };

  // Jump to the first step that has a server-side error
  const [seenFields, setSeenFields] = useState(state.fields);
  if (seenFields !== state.fields) {
    setSeenFields(state.fields);
    const first = STEP_FIELDS.findIndex((fs) => fs.some((f) => state.fields[f]));
    if (first >= 0) setStep(first);
  }

  if (state.status === "success" && result) {
    return (
      <div className="card p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-neon" />
        <h2 className="mt-5 text-2xl sm:text-3xl font-semibold text-white">Project submitted</h2>
        <p className="mx-auto mt-3 max-w-md text-soft">
          Your project has been sent with reference <strong className="font-mono text-neon">{result.reference}</strong>. We will review your requirements and contact you by email.
        </p>
        {result.confirmation === "sent" && <p className="mt-3 text-sm text-muted">A confirmation email has been sent to you.</p>}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to home <ArrowRight className="h-4 w-4" /></ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Contact us</ButtonLink>
        </div>
      </div>
    );
  }

  function validateStep(form: HTMLFormElement, s: number) {
    const errs: Record<string, string> = {};
    for (const name of STEP_FIELDS[s]) {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el && !el.checkValidity()) errs[name] = el.validationMessage || "Please check this field";
    }
    setLocalErrors(errs);
    if (Object.keys(errs).length) {
      (form.elements.namedItem(Object.keys(errs)[0]) as HTMLElement | null)?.focus();
      return false;
    }
    return true;
  }

  const current = step;
  const visible = (s: number) => current === s;
  const err = (k: string) => errors[k];
  const inv = (k: string) => (err(k) ? true : undefined);

  return (
    <form
      noValidate
      className="card relative p-6 sm:p-10"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (current < 2) {
          if (validateStep(form, current)) setStep(current + 1);
          return;
        }
        for (let s = 0; s <= 2; s++) {
          if (!validateStep(form, s)) {
            setStep(s);
            return;
          }
        }
        await submit(formToObject(form));
      }}
    >
      <SpamGuard />
      <ol className="mb-10 grid grid-cols-3 gap-2" aria-label="Form progress">
        {STEP_TITLES.map((t, i) => (
          <li key={t} aria-current={current === i ? "step" : undefined}>
            <div className={cn("h-1 rounded-full transition-colors", i <= current ? "bg-neon" : "bg-line")} />
            <p className={cn("mt-2 text-xs sm:text-sm", i === current ? "text-white" : "text-muted")}><span className="font-mono">0{i + 1}</span> <span className="hidden sm:inline">· {t}</span></p>
          </li>
        ))}
      </ol>

      <fieldset hidden={!visible(0)} className="space-y-5">
        <legend className="mb-6 text-xl font-semibold text-white">About you &amp; your business</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="p-name" required error={err("full_name")}><Input id="p-name" name="full_name" required minLength={2} maxLength={120} autoComplete="name" defaultValue={defaults.full_name} aria-invalid={inv("full_name")} /></Field>
          <Field label="Email address" htmlFor="p-email" required error={err("email")}><Input id="p-email" name="email" type="email" required maxLength={254} autoComplete="email" defaultValue={defaults.email} aria-invalid={inv("email")} /></Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business name" htmlFor="p-biz" required error={err("business_name")}><Input id="p-biz" name="business_name" required minLength={2} maxLength={160} autoComplete="organization" aria-invalid={inv("business_name")} /></Field>
          <Field label="Business website" htmlFor="p-site" error={err("business_website")} hint="Optional"><Input id="p-site" name="business_website" type="text" inputMode="url" placeholder="https://" maxLength={300} aria-invalid={inv("business_website")} /></Field>
        </div>
        <Field label="Industry" htmlFor="p-industry" required error={err("industry")}>
          <Select id="p-industry" name="industry" required defaultValue={INDUSTRIES.find((i) => i === defaults.industry) ?? ""} aria-invalid={inv("industry")}>
            <option value="" disabled>Select your industry</option>
            {INDUSTRIES.map((i) => (<option key={i}>{i}</option>))}
          </Select>
        </Field>
      </fieldset>

      <fieldset hidden={!visible(1)} className="space-y-5">
        <legend className="mb-6 text-xl font-semibold text-white">Tell us about the project</legend>
        <Field label="Service required" htmlFor="p-service" required error={err("service_required")}>
          <Select id="p-service" name="service_required" required defaultValue={services.find((s) => s === defaults.service) ?? ""} aria-invalid={inv("service_required")}>
            <option value="" disabled>Select a service</option>
            {services.map((s) => (<option key={s}>{s}</option>))}
            <option>Not sure — need advice</option>
          </Select>
        </Field>
        <Field label="Project description" htmlFor="p-desc" required error={err("description")} hint="What do you want to build? At least 20 characters.">
          <Textarea id="p-desc" name="description" required minLength={20} maxLength={5000} rows={5} defaultValue={defaults.notes} aria-invalid={inv("description")} />
        </Field>
        <Field label="Current business problem" htmlFor="p-problem" required error={err("current_problem")} hint="What is slow, manual or error-prone today?">
          <Textarea id="p-problem" name="current_problem" required minLength={10} maxLength={5000} rows={4} aria-invalid={inv("current_problem")} />
        </Field>
        <Field label="Desired automation" htmlFor="p-desired" required error={err("desired_automation")} hint="What should happen automatically once it's built?">
          <Textarea id="p-desired" name="desired_automation" required minLength={10} maxLength={5000} rows={4} aria-invalid={inv("desired_automation")} />
        </Field>
      </fieldset>

      <fieldset hidden={!visible(2)} className="space-y-5">
        <legend className="mb-6 text-xl font-semibold text-white">Scope, budget &amp; tools</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Estimated budget" htmlFor="p-budget" required error={err("budget")}>
            <Select id="p-budget" name="budget" required defaultValue="" aria-invalid={inv("budget")}>
              <option value="" disabled>Select a range</option>
              {BUDGETS.map((b) => (<option key={b}>{b}</option>))}
            </Select>
          </Field>
          <Field label="Expected timeline" htmlFor="p-timeline" required error={err("timeline")}>
            <Select id="p-timeline" name="timeline" required defaultValue="" aria-invalid={inv("timeline")}>
              <option value="" disabled>Select a timeline</option>
              {TIMELINES.map((t) => (<option key={t}>{t}</option>))}
            </Select>
          </Field>
        </div>
        <Field label="Existing tools" htmlFor="p-tools" error={err("existing_tools")} hint="e.g. Gmail, Google Sheets, Shopify, WhatsApp Business, HubSpot">
          <Textarea id="p-tools" name="existing_tools" maxLength={2000} rows={3} />
        </Field>
        <Field label="Additional requirements" htmlFor="p-extra" error={err("additional_requirements")} hint="Optional — integrations, security needs, languages, anything else.">
          <Textarea id="p-extra" name="additional_requirements" maxLength={5000} rows={4} />
        </Field>
        <p className="text-xs text-muted">By submitting, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
      </fieldset>

      {state.status === "error" && <div className="mt-6"><Alert tone="error">{state.error}</Alert></div>}

      <div className="mt-10 flex items-center justify-between gap-3">
        {current > 0 ? (
          <Button type="button" variant="ghost" onClick={() => { setStep(current - 1); setLocalErrors({}); }}><ArrowLeft className="h-4 w-4" /> Back</Button>
        ) : <span />}
        {current < 2 ? (
          <Button type="submit">Continue <ArrowRight className="h-4 w-4" /></Button>
        ) : (
          <Button type="submit" size="lg" disabled={state.status === "submitting"}>
            {state.status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><Rocket className="h-4 w-4" /> Submit Project</>}
          </Button>
        )}
      </div>
    </form>
  );
}
