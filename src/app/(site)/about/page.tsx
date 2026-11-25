import { Target, Eye, ShieldCheck, Lightbulb, Handshake, Gauge, Store, Building2, Megaphone, Stethoscope, GraduationCap, Briefcase } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SocialLinks } from "@/components/layout/social-links";
import { CtaBanner } from "@/components/home/sections";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "About",
  description: "Learn who Maaz AI Wala is, why we focus on AI automation, and how we approach solving business problems with n8n and AI.",
  path: "/about",
});

const values = [
  { icon: ShieldCheck, title: "Honesty", text: "Realistic timelines, clear pricing conversations and no inflated promises." },
  { icon: Lightbulb, title: "Practical innovation", text: "We use AI where it genuinely helps — not because it is trendy." },
  { icon: Gauge, title: "Reliability", text: "Error handling, testing and monitoring are part of every build." },
  { icon: Handshake, title: "Partnership", text: "We explain what we build so you understand and own your systems." },
];
const audiences = [
  { icon: Store, label: "E-commerce stores" }, { icon: Building2, label: "Real estate businesses" },
  { icon: Megaphone, label: "Marketing agencies" }, { icon: Stethoscope, label: "Clinics & service providers" },
  { icon: GraduationCap, label: "Education & coaching" }, { icon: Briefcase, label: "Small & growing businesses" },
];
const stack = ["n8n", "Google Gemini", "OpenAI / Claude APIs", "Webhooks & REST APIs", "Google Workspace", "Supabase / PostgreSQL", "Next.js", "CRM integrations"];

export default async function AboutPage() {
  const settings = await getSettings();
  const a = settings.about;
  return (
    <>
      <PageHero eyebrow="About Maaz AI Wala" title={<>We turn repetitive work into <span className="text-gradient">intelligent systems</span></>} description={a.intro} />
      <Section className="pt-0">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card p-8"><p className="eyebrow mb-3">What we do</p><h2 className="text-2xl font-semibold text-white">AI automation, built around your process</h2><p className="mt-4 leading-relaxed text-soft">{a.approach}</p></Reveal>
          <Reveal className="card p-8" delay={0.06}><p className="eyebrow mb-3">Why AI automation</p><h2 className="text-2xl font-semibold text-white">Your tools, finally working together</h2><p className="mt-4 leading-relaxed text-soft">{a.why}</p></Reveal>
        </div>
      </Section>
      <Section className="bg-ink/40">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-neon/25 bg-neon/[.04] p-8"><Target className="h-7 w-7 text-neon" /><h2 className="mt-4 text-xl font-semibold text-white">Our Mission</h2><p className="mt-3 leading-relaxed text-soft">{a.mission}</p></Reveal>
          <Reveal className="rounded-2xl border border-line bg-surface p-8" delay={0.06}><Eye className="h-7 w-7 text-neon" /><h2 className="mt-4 text-xl font-semibold text-white">Our Vision</h2><p className="mt-3 leading-relaxed text-soft">{a.vision}</p></Reveal>
        </div>
      </Section>
      <Section>
        <SectionHeading eyebrow="Core values" title="How we work" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05} className="card card-hover p-6"><v.icon className="h-6 w-6 text-neon" /><h3 className="mt-4 font-semibold text-white">{v.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p></Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-ink/40">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Who we help" title="Businesses that benefit most" description="Any business with repetitive, rules-based work can benefit. These are some of the most common." />
            <ul className="grid gap-3 sm:grid-cols-2">
              {audiences.map((x) => (<li key={x.label} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm text-white/90"><x.icon className="h-5 w-5 text-neon" />{x.label}</li>))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Technology expertise" title="Tools we build with" description="We choose tools based on reliability, cost and fit for your business." />
            <ul className="flex flex-wrap gap-2.5">
              {stack.map((t) => (<li key={t} className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs text-soft">{t}</li>))}
            </ul>
            <div className="mt-10"><p className="mb-4 text-sm text-muted">Follow our work and tutorials:</p><SocialLinks urls={settings.social} withLabels /></div>
            <div className="mt-8"><ButtonLink href="/services" variant="outline">Explore services</ButtonLink></div>
          </div>
        </div>
      </Section>
      <CtaBanner cta={settings.cta} />
    </>
  );
}
