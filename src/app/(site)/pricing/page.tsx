import { Check, Minus, ArrowRight, Sparkles, Info } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/faq";
import { getPricing } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { cn, formatMoney } from "@/lib/utils";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Pricing",
  description: "AI automation pricing: Starter $500 and Professional $2,000 one-time development fees, or a custom quote. Compare workflows, AI and integrations.",
  path: "/pricing",
});

type Cell = boolean | string;
/** Comparison built only from what each package includes — nothing extra is promised. */
const COMPARISON: { group: string; rows: { label: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    group: "Workflows & AI",
    rows: [
      { label: "Custom automation workflows", values: ["1–2", "3–7 advanced", "More than 7"] },
      { label: "n8n workflow development", values: [true, true, true] },
      { label: "AI integration", values: ["Basic", "Advanced AI agents", "Custom AI agents"] },
      { label: "OpenAI and Google Gemini integration", values: [false, true, true] },
      { label: "Complex conditional logic", values: [false, true, true] },
    ],
  },
  {
    group: "Integrations",
    rows: [
      { label: "Google Sheets", values: [true, true, true] },
      { label: "Gmail automation / AI email management", values: ["Gmail automation", "AI-powered", true] },
      { label: "CRM integration", values: ["Basic", "Advanced", true] },
      { label: "WhatsApp Business API automation", values: [false, true, true] },
      { label: "Database integration", values: [false, true, true] },
      { label: "API integrations and webhooks", values: [false, true, true] },
      { label: "Multi-platform integrations", values: [false, true, true] },
    ],
  },
  {
    group: "Business automations",
    rows: [
      { label: "Lead capture and management", values: [true, true, true] },
      { label: "Automated lead generation and qualification", values: [false, true, true] },
      { label: "Automated notifications", values: [true, true, true] },
      { label: "Intelligent customer support systems", values: [false, true, true] },
      { label: "Automated sales and follow-up systems", values: [false, true, true] },
      { label: "Automated appointment booking", values: [false, true, true] },
      { label: "Data processing", values: ["Basic", true, true] },
      { label: "Automated reporting and analytics", values: [false, true, true] },
    ],
  },
  {
    group: "Delivery",
    rows: [
      { label: "Error handling", values: [false, "Advanced", true] },
      { label: "Workflow testing", values: [true, "Testing + optimization", true] },
      { label: "Deployment and handover", values: ["Final", "Complete", true] },
    ],
  },
];

const ADDITIONAL = [
  { t: "Third-party subscriptions", d: "n8n Cloud (or your server), AI model usage (OpenAI / Gemini), WhatsApp Business API and other tools are billed by those providers directly to your own accounts." },
  { t: "Extra workflows or features", d: "Anything beyond your package is quoted separately by email before work starts — no surprise charges." },
  { t: "Ongoing changes after handover", d: "New features or changes after the project is handed over are quoted separately by email." },
];

const FAQ = [
  { q: "Are prices one-time or monthly?", a: "Both packages are a one-time development fee for building your automation." },
  { q: "What is not included?", a: "Third-party tool subscriptions and AI usage costs are paid directly by you to each provider." },
  { q: "How do I get a quote for a bigger project?", a: "Submit your project details. We review your requirements and send a written quotation by email." },
  { q: "How do we communicate?", a: "Everything happens by email, so you always have a written record of what was agreed. We don't do calls or meetings." },
  { q: "How do payments work?", a: "Work starts after you accept the quotation and the agreed payment is confirmed. Payments are verified before a project is marked paid." },
];

export default async function PricingPage() {
  const { items } = await getPricing();
  const plans = items.slice(0, 3);
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>Simple, transparent <span className="text-gradient">pricing</span></>}
        description="One-time development fees with no hidden costs. Your final price is confirmed by email in a written quotation after we review your requirements." />
      <Section className="pt-0">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {items.map((p, i) => {
            const price = formatMoney(p.price, p.currency);
            const href = p.price === null ? `/start-project?package=${encodeURIComponent(p.name)}` : `/start-project?package=${encodeURIComponent(p.name)}`;
            return (
              <Reveal key={p.slug} delay={i * 0.06}>
                <article className={cn("card relative flex h-full flex-col p-8", p.is_featured && "border-neon/60 shadow-[0_0_0_1px_rgba(167,139,250,.3),0_30px_80px_-30px_rgba(167,139,250,.5)]")}>
                  {p.is_featured && <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-neon to-cyan px-3 py-1 text-xs font-semibold text-onbrand"><Sparkles className="h-3 w-3" /> Most popular</span>}
                  <h2 className="text-xl font-semibold text-white">{p.name}</h2>
                  <p className="mt-2 min-h-12 text-sm text-muted">{p.description}</p>
                  <div className="mt-6 border-y border-line py-6">
                    {price ? (
                      <p className="flex flex-wrap items-baseline gap-2"><span className="text-5xl font-semibold tracking-tight text-white">{price}</span>{p.billing_note && <span className="rounded-full bg-cyan/10 px-2.5 py-0.5 text-xs text-cyan">{p.billing_note}</span>}</p>
                    ) : (
                      <p className="text-3xl font-semibold tracking-tight text-white">Contact for Pricing</p>
                    )}
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      {p.workflows_included && <div><dt className="text-muted">Workflows</dt><dd className="mt-0.5 text-white">{p.workflows_included}</dd></div>}
                      {p.support_period && <div><dt className="text-muted">Support</dt><dd className="mt-0.5 text-white">{p.support_period}</dd></div>}
                    </dl>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">{p.features.map((f) => <li key={f} className="flex gap-3 text-sm text-soft"><Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" />{f}</li>)}</ul>
                  <ButtonLink href={href} variant={p.is_featured ? "primary" : "secondary"} className="mt-8 w-full">{p.price === null ? p.cta_text || "Contact for Pricing" : "Get Started"}</ButtonLink>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {plans.length === 3 && (
        <Section className="bg-ink/40">
          <SectionHeading eyebrow="Compare plans" title="Detailed plan comparison" />
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Comparison of pricing plans</caption>
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="px-5 py-4 font-medium text-muted">Feature</th>
                  {plans.map((p) => <th key={p.slug} scope="col" className={cn("px-5 py-4 font-semibold", p.is_featured ? "text-neon" : "text-white")}>{p.name}<span className="block text-xs font-normal text-muted">{formatMoney(p.price, p.currency) ?? "Contact"}</span></th>)}
                </tr>
              </thead>
              {COMPARISON.map((g) => (
                <tbody key={g.group} className="divide-y divide-line">
                  <tr className="bg-white/[.02]"><th colSpan={4} scope="colgroup" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neon">{g.group}</th></tr>
                  {g.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row" className="px-5 py-3.5 font-normal text-soft">{r.label}</th>
                      {r.values.map((v, i) => (
                        <td key={i} className="px-5 py-3.5 text-white">
                          {v === true ? <Check className="h-4 w-4 text-neon" aria-label="Included" /> : v === false ? <Minus className="h-4 w-4 text-muted" aria-label="Not included" /> : v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-muted">Your written quotation states exactly what is included in your project.</p>
        </Section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Good to know" title="Additional costs & optional services" />
            <ul className="space-y-4">
              {ADDITIONAL.map((a) => (
                <li key={a.t} className="flex gap-4 rounded-2xl border border-line bg-surface/60 p-5">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
                  <div><p className="font-medium text-white">{a.t}</p><p className="mt-1 text-sm leading-relaxed text-muted">{a.d}</p></div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="FAQ" title="Pricing questions" />
            <Faq items={FAQ} />
            <div className="mt-8 rounded-2xl border border-neon/30 bg-gradient-to-br from-neon/10 to-cyan/5 p-6">
              <h3 className="font-semibold text-white">Need a custom quotation?</h3>
              <p className="mt-1 text-sm text-muted">Send your requirements and get a written quote by email.</p>
              <div className="mt-4 flex flex-wrap gap-3"><ButtonLink href="/start-project?package=Custom">Request a quote <ArrowRight className="h-4 w-4" /></ButtonLink><ButtonLink href="/contact" variant="secondary">Email us</ButtonLink></div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
