import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Clock, Hand, TrendingUp, Rocket, MessagesSquare, Users, Settings2,
  Megaphone, Database, Repeat, Puzzle, Brain, Briefcase, Layers, PlugZap, MessageCircle, CheckCircle2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon } from "@/components/ui/icon";
import { HeroVisual } from "@/components/home/hero-visual";
import { AnimatedHeading } from "@/components/layout/effects";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";
import { SocialLinks, type SocialUrls } from "@/components/layout/social-links";
import type { Service } from "@/lib/types";
import type { SiteSettings } from "@/lib/defaults";

export function Hero({ hero, social }: { hero: SiteSettings["hero"]; social: SocialUrls }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-36 lg:pt-40 lg:pb-24">
      <div aria-hidden className="absolute inset-0 grid-bg" />
      <div aria-hidden className="aurora absolute -left-40 top-20 h-96 w-96 rounded-full bg-neon/[.12] blur-[120px]" />
      <div aria-hidden className="aurora absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#14b8a6]/[.10] blur-[120px] [animation-delay:-6s]" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-neon/25 bg-neon/[.06] px-3.5 py-1.5 font-mono text-[11px] tracking-[.22em] text-neon">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_#a78bfa]" />
            {hero.label}
          </p>
          <AnimatedHeading
            text={hero.heading}
            className="mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem] font-semibold tracking-[-0.035em] text-white"
          />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft text-pretty">{hero.description}</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <ButtonLink href="/start-project" size="lg">{hero.primary_cta} <ArrowRight className="h-4 w-4" /></ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">{hero.secondary_cta}</ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">
            Not sure where to start? <Link href="/contact" className="font-medium text-neon underline-offset-4 hover:underline">Email us your idea →</Link>
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {["n8n workflows", "AI agents", "Chatbots", "Integrations"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-neon" />{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[.2em] text-muted">Follow us</span>
            <SocialLinks urls={social} />
          </div>
        </Reveal>
        <HeroVisual />
      </div>
    </section>
  );
}

const benefits = [
  { icon: Clock, title: "Save Time", text: "Hand routine tasks to systems that run 24/7, so your team focuses on real work." },
  { icon: Hand, title: "Reduce Manual Work", text: "Stop copying data between apps and writing the same replies again and again." },
  { icon: TrendingUp, title: "Improve Productivity", text: "Faster responses, fewer errors and smoother hand-offs across your operations." },
  { icon: Rocket, title: "Scale Your Business", text: "Handle more customers and requests without adding the same amount of admin." },
];

export function Benefits() {
  return (
    <Section>
      <SectionHeading eyebrow="Why automation" title={<>Work Smarter. <span className="text-neon">Automate Better.</span></>}
        description="Automation is not about replacing people — it is about removing the repetitive work that slows them down." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.06}>
            <div className="card card-hover h-full p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/25 bg-neon/[.08]"><b.icon className="h-5 w-5 text-neon" /></span>
              <h3 className="mt-5 text-lg font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function ServicesGrid({ services, limit = 6, heading = true }: { services: Service[]; limit?: number; heading?: boolean }) {
  return (
    <Section id="services" className="bg-ink/40">
      {heading && (
        <SectionHeading eyebrow="What we build" title="Automation services built around your business"
          description="From a single workflow to complete AI-powered systems — designed, tested and documented." />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, limit).map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.06}>
            <article className="card card-hover group flex h-full flex-col p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon/20 to-neon/[.02] ring-1 ring-neon/25">
                <ServiceIcon name={s.icon} className="h-6 w-6 text-neon" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{s.short_description}</p>
              <Link href={`/services/${s.slug}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neon">
                Learn More <span className="sr-only">about {s.title}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
      {services.length > limit && (
        <div className="mt-10 text-center"><ButtonLink href="/services" variant="outline">View all services <ArrowRight className="h-4 w-4" /></ButtonLink></div>
      )}
    </Section>
  );
}

const helpAreas = [
  { icon: MessagesSquare, title: "Customer communication", text: "Instant answers, smart routing and consistent follow-ups on every channel." },
  { icon: Users, title: "Lead management", text: "Capture, qualify and organise every lead so none of them slip through." },
  { icon: Settings2, title: "Business operations", text: "Connect your tools so orders, tasks and updates flow automatically." },
  { icon: Megaphone, title: "Marketing workflows", text: "Content pipelines, approvals and scheduling without the spreadsheet chaos." },
  { icon: Database, title: "Data management", text: "Extract, clean and sync data between documents, sheets and databases." },
  { icon: Repeat, title: "Repetitive daily tasks", text: "Reports, reminders and data entry handled on schedule, every time." },
];

export function HowWeHelp() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" eyebrow="How we help" title="Automation where it makes the biggest difference"
            description="We look for the places in your business where time is lost to repetition — then build systems that take over." />
          <ButtonLink href="/solutions" variant="secondary">See industry solutions <ArrowRight className="h-4 w-4" /></ButtonLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {helpAreas.map((a, i) => (
            <Reveal key={a.title} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-2xl border border-line bg-surface/60 p-6 transition hover:border-line-strong">
                <a.icon className="h-6 w-6 text-neon" aria-hidden />
                <h3 className="mt-4 font-semibold text-white">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export const demoWorkflows = [
  { title: "Smart form intake", steps: ["Customer Form", "AI Agent", "Google Sheets", "Email Notification"], text: "Form submissions are understood by AI, stored in a sheet and the right person is notified." },
  { title: "Lead qualification", steps: ["New Lead", "AI Qualification", "CRM", "Follow-up Email"], text: "Every lead is scored, saved to your CRM and sent a timely, personalised follow-up." },
  { title: "Support assistant", steps: ["Incoming Message", "AI Assistant", "Response", "Customer Support"], text: "Common questions are answered instantly; complex cases reach your team with context." },
];

export function WorkflowDemos() {
  return (
    <Section className="bg-ink/40">
      <SectionHeading eyebrow="Featured workflows" title="See how an automation flows"
        description="Sample workflows that show the kind of systems we design. These are demonstrations, not client case studies." />
      <div className="grid gap-5">
        {demoWorkflows.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.06}>
            <div className="card p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{w.title}</h3>
                  <p className="mt-1 text-sm text-muted">{w.text}</p>
                </div>
                <span className="rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-warning">Demo</span>
              </div>
              <WorkflowDiagram steps={w.steps} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export const processSteps = [
  { title: "Share Your Requirements", text: "Tell us about your business, your tools and the work you want to automate." },
  { title: "We Analyze Your Business", text: "We map your current process and find the steps worth automating first." },
  { title: "We Design Your Automation", text: "You get a clear plan: workflow, integrations, AI logic and expected outcome." },
  { title: "We Build and Test", text: "We build the system and test real scenarios, edge cases and error handling." },
  { title: "Deployment and Support", text: "We launch it on your accounts, hand over documentation and support you as agreed." },
];

export function ProcessSteps() {
  return (
    <Section>
      <SectionHeading eyebrow="How it works" title="From idea to working automation in five steps" />
      <div className="relative">
      <div aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent md:block" />
      <ol className="relative grid gap-4 md:grid-cols-5">
        {processSteps.map((s, i) => (
          <li key={s.title} className="relative">
            <Reveal delay={i * 0.07} className="relative h-full rounded-2xl border border-line bg-surface/70 p-6 md:border-0 md:bg-transparent md:p-0 md:text-center">
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/40 bg-base font-mono text-lg font-semibold text-neon shadow-[0_0_30px_-8px_#a78bfa] md:mx-auto">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      </div>
      <div className="mt-12 text-center"><ButtonLink href="/how-it-works" variant="outline">Explore our process <ArrowRight className="h-4 w-4" /></ButtonLink></div>
    </Section>
  );
}

const reasons = [
  { icon: Puzzle, title: "Custom Automation Solutions", text: "Built for your exact process — not a one-size-fits-all template." },
  { icon: Brain, title: "AI-Powered Systems", text: "Modern AI models applied where they genuinely add value." },
  { icon: Briefcase, title: "Business-Focused Approach", text: "We measure success in time saved and problems solved." },
  { icon: Layers, title: "Scalable Workflows", text: "Designed to grow with your volume without breaking." },
  { icon: PlugZap, title: "Reliable Integrations", text: "Validation, retries and error alerts built in from day one." },
  { icon: MessageCircle, title: "Clear Communication", text: "Plain-language updates, documentation and honest timelines." },
];

export function WhyUs() {
  return (
    <Section className="bg-ink/40">
      <SectionHeading eyebrow="Why choose us" title="Built properly. Explained clearly." />
      <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.title} className="bg-surface p-7 transition-colors hover:bg-elevated">
            <r.icon className="h-6 w-6 text-neon" aria-hidden />
            <h3 className="mt-4 font-semibold text-white">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function SocialSection({ social }: { social: SocialUrls }) {
  return (
    <Section className="py-16 sm:py-20">
      <Reveal className="card flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
        <p className="eyebrow">Follow the journey</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">Practical AI &amp; automation tutorials</h2>
        <p className="max-w-xl text-muted">Follow Maaz AI Wala for real workflow builds, AI tool breakdowns and automation tips.</p>
        <SocialLinks urls={social} withLabels className="justify-center" />
      </Reveal>
    </Section>
  );
}

export function CtaBanner({ cta }: { cta: SiteSettings["cta"] }) {
  return (
    <Section className="pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-neon/25 bg-gradient-to-br from-elevated via-surface to-ink px-6 py-16 text-center sm:px-14 sm:py-20">
          <div aria-hidden className="absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-neon/20 blur-[100px]" />
          <div aria-hidden className="absolute inset-0 grid-bg opacity-50" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl sm:text-5xl font-semibold tracking-tight text-white text-balance">{cta.heading}</h2>
            <p className="mx-auto mt-5 max-w-xl text-soft">{cta.description}</p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <ButtonLink href="/start-project" size="lg">{cta.button} <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="secondary">Talk to us</ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

const TOOLS = ["n8n", "Google Gemini", "OpenAI", "Claude", "Gmail", "Google Sheets", "Google Drive", "WhatsApp", "Slack", "Notion", "Shopify", "HubSpot", "Webhooks & APIs", "Supabase"];
export function Marquee() {
  const row = [...TOOLS, ...TOOLS];
  return (
    <section aria-label="Tools we work with" className="marquee relative overflow-hidden border-y border-line bg-ink/60 py-5">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent" />
      <p className="sr-only">{TOOLS.join(", ")}</p>
      <div aria-hidden className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="mx-3 flex items-center gap-3 rounded-full border border-line bg-surface/70 px-5 py-2 font-mono text-xs text-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_#a78bfa]" />{t}
          </span>
        ))}
      </div>
    </section>
  );
}
