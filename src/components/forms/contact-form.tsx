"use client";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Alert, Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { SpamGuard } from "@/components/forms/honeypot";
import { formToObject, useJsonForm } from "@/components/forms/use-json-form";
import { BUDGETS } from "@/lib/validation";

export function ContactForm({ services }: { services: string[] }) {
  const { state, result, submit, reset } = useJsonForm<{ confirmation?: string }>("/api/contact");
  const err = (k: string) => state.fields[k];

  if (state.status === "success") {
    return (
      <div className="card flex flex-col items-center p-10 text-center" role="status">
        <CheckCircle2 className="h-12 w-12 text-neon" />
        <h2 className="mt-4 text-2xl font-semibold text-white">Message received</h2>
        <p className="mt-2 max-w-sm text-muted">Thank you for reaching out. Your message has been saved and we will reply to your email.</p>
        {result?.confirmation === "sent" && <p className="mt-2 text-sm text-neon">A confirmation email is on its way to you.</p>}
        <Button variant="secondary" className="mt-6" onClick={reset}>Send another message</Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="card relative space-y-5 p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const ok = await submit(formToObject(e.currentTarget));
        if (ok) e.currentTarget?.reset();
      }}
    >
      <SpamGuard />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="c-name" required error={err("full_name")}>
          <Input id="c-name" name="full_name" autoComplete="name" required maxLength={120} aria-invalid={!!err("full_name")} />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={err("email")}>
          <Input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!err("email")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Subject" htmlFor="c-subject" required error={err("subject")}>
          <Input id="c-subject" name="subject" required maxLength={200} aria-invalid={!!err("subject")} />
        </Field>
        <Field label="Service interest" htmlFor="c-service" error={err("service_interest")}>
          <Select id="c-service" name="service_interest" defaultValue="">
            <option value="">Not sure yet</option>
            {services.map((s) => (<option key={s} value={s}>{s}</option>))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Project budget" htmlFor="c-budget" error={err("budget")}>
          <Select id="c-budget" name="budget" defaultValue="">
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (<option key={b} value={b}>{b}</option>))}
          </Select>
        </Field>
        <Field label="Phone number (optional)" htmlFor="c-phone" error={err("phone")} hint="Optional — we reply by email only, so you can leave this empty.">
          <Input id="c-phone" name="phone" inputMode="tel" autoComplete="tel" maxLength={40} aria-invalid={!!err("phone")} />
        </Field>
      </div>
      <Field label="Project description" htmlFor="c-message" required error={err("message")}>
        <Textarea id="c-message" name="message" rows={6} required minLength={10} maxLength={5000} aria-invalid={!!err("message")} />
      </Field>
      {state.status === "error" && <Alert tone="error">{state.error}</Alert>}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state.status === "submitting"}>
        {state.status === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send Message</>}
      </Button>
    </form>
  );
}
