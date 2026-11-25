import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, Quote, ShieldCheck, Star, FlaskConical } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icon";
import { CountUp } from "@/components/home/count-up";
import { LiteYouTube } from "@/components/home/lite-youtube";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";
import { INTEGRATIONS } from "@/lib/catalog/integrations";
import { INDUSTRIES } from "@/lib/catalog/industries";
import type { PortfolioProject, Testimonial } from "@/lib/types";

/** Stats are factual counts about what the agency offers — not invented client metrics. */
export function Stats({ services }: { services: number }) {
  const stats = [
    { value: services, suffix: "", label: "AI automation services" },
    { value: INDUSTRIES.length, suffix: "", label: "Industry solution kits" },
    { value: INTEGRATIONS.length, suffix: "+", label: "Integrations supported" },
    { value: 24, suffix: "/7", label: "Automations that never sleep" },
  ];
  return (
    <section aria-label="At a glance" className="relative py-16">
      <div className="container-page">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-7 text-center sm:p-9">
              <p className="text-gradient text-4xl font-semibold tabular-nums sm:text-5xl"><CountUp to={s.value} />{s.suffix}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects({ items }: { items: PortfolioProject[] }) {
  if (!items.length) return null;
  return (
    <Section>
      <SectionHeading eyebrow="Featured automations" title="Systems we design & build" description="A look at the kind of automation projects we deliver. Items marked Demo are sample builds, not client case studies." />
      <div className="grid gap-5 lg:grid-cols-3">
        {items.slice(0, 3).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <Link href={`/portfolio/${p.slug}`} className="card card-hover group flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-neon/10 px-3 py-1 text-xs text-neon">{p.category}</span>
                {p.is_demo && <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-warning"><FlaskConical className="h-3 w-3" />Own build</span>}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary || p.solution}</p>
              {p.workflow_steps?.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-1.5 text-[11px] text-soft">
                  {p.workflow_steps.slice(0, 4).map((s, j) => (
                    <span key={s} className="flex items-center gap-1.5">{j > 0 && <ArrowRight className="h-3 w-3 text-neon" />}<span className="rounded-md border border-line bg-ink/60 px-2 py-1">{s}</span></span>
                  ))}
                </div>
              )}
              <span className="mt-5 inline-flex items-center gap-1 text-sm text-neon">View project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center"><ButtonLink href="/portfolio" variant="outline">View portfolio <ArrowRight className="h-4 w-4" /></ButtonLink></div>
    </Section>
  );
}

export function IntegrationsGrid() {
  return (
    <Section className="bg-ink/40">
      <SectionHeading eyebrow="Integrations" title="Connects with the tools you already use" description="Every integration is set up on your own accounts with your own credentials — nothing is shared." />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {INTEGRATIONS.map((i, n) => (
          <li key={i.name}>
            <Reveal delay={(n % 5) * 0.03} className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-surface/70 p-4 transition hover:-translate-y-0.5 hover:border-neon/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neon/20 to-cyan/10 ring-1 ring-neon/20 transition group-hover:from-neon/40 group-hover:to-cyan/30">
                <ServiceIcon name={i.icon} className="h-5 w-5 text-neon" />
              </span>
              <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{i.name}</p><p className="truncate text-[11px] text-muted">{i.group}</p></div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Client feedback" title="What clients say" />
      {items.length === 0 ? (
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-dashed border-line-strong p-10 text-center">
          <ShieldCheck className="h-10 w-10 text-neon" />
          <p className="mt-4 text-lg font-medium text-white">We only publish verified reviews from real clients.</p>
          <p className="mt-2 text-sm text-muted">Client testimonials will appear here as projects are completed. Want to be one of our first featured success stories?</p>
          <ButtonLink href="/start-project" className="mt-6">Start your project</ButtonLink>
        </Reveal>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06}>
              <figure className="card flex h-full flex-col p-7">
                <Quote className="h-7 w-7 text-neon" />
                {t.rating && <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, k) => <Star key={k} className={k < t.rating! ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-line-strong"} />)}</div>}
                <blockquote className="mt-4 flex-1 leading-relaxed text-soft">“{t.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <p className="font-medium text-white">{t.author_name}</p>
                  <p className="text-sm text-muted">{[t.author_role, t.company].filter(Boolean).join(", ")}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

export function ConsultCta() {
  return (
    <section className="py-10">
      <div className="container-page">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-cyan/30 bg-gradient-to-r from-cyan/10 via-neon/5 to-transparent p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">Not sure which automation you need?</h2>
            <p className="mt-2 text-soft">Send us your idea by email — we&apos;ll review your process and reply with the highest-impact automation to start with.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact"><Mail className="h-4 w-4" /> Email us your idea</ButtonLink>
            <ButtonLink href="/demos" variant="secondary">Try a live demo</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function DemoTeaser() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <SectionHeading align="left" eyebrow="Interactive demo" title="See an automation run — step by step"
          description="Trigger a workflow, watch data flow between nodes, read the AI's response and compare the manual process with the automated one." />
        <Reveal className="card p-6 sm:p-8">
          <WorkflowDiagram steps={["New lead", "AI scoring", "CRM", "Alert", "Follow-up"]} />
          <div className="mt-6 rounded-xl bg-ink/70 p-4 font-mono text-xs text-soft">
            <p><span className="text-neon">✓</span> AI qualification — <span className="text-cyan">HOT · score 86</span></p>
            <p className="mt-1"><span className="text-neon">✓</span> Follow-up email sent</p>
          </div>
          <ButtonLink href="/demos" className="mt-6">Run the interactive demo <ArrowRight className="h-4 w-4" /></ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}

export function YouTubeSection({ video, channel }: { video: string; channel?: string }) {
  if (!video) return null;
  return (
    <Section className="bg-ink/40">
      <SectionHeading eyebrow="On YouTube" title="Watch how we build automations" />
      <Reveal className="mx-auto max-w-4xl"><LiteYouTube idOrUrl={video} title="Maaz AI Wala on YouTube" /></Reveal>
      {channel && <div className="mt-8 text-center"><ButtonLink href={channel} external variant="outline">Visit the YouTube channel</ButtonLink></div>}
    </Section>
  );
}

/** P2-6: price anchor on the home page so visitors can estimate cost. */
export function PricingPreview({ items }: { items: import("@/lib/types").PricingPackage[] }) {
  if (!items.length) return null;
  const fmt = (p: number | null, c: string) =>
    p === null ? "Contact for pricing" : new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(p);
  return (
    <Section className="bg-ink/40">
      <SectionHeading eyebrow="Pricing" title="Clear, one-time pricing" description="Starting prices for typical projects. Your final price is confirmed by email in a written quotation." />
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {items.slice(0, 3).map((p) => (
          <Link key={p.slug} href="/pricing" className={`card card-hover flex flex-col p-6 ${p.is_featured ? "border-neon/50" : ""}`}>
            <p className="text-sm font-medium text-soft">{p.name}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{p.price === null ? "Custom" : <>From {fmt(p.price, p.currency)}</>}</p>
            <p className="mt-1 text-xs text-cyan">{p.billing_note || "Quoted by email"}</p>
            <p className="mt-4 flex-1 text-sm text-muted">{p.description}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm text-neon">See what&apos;s included <ArrowRight className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
