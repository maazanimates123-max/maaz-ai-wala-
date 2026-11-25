import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Mail, Check, AlertTriangle, Lightbulb } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icon";
import { Faq } from "@/components/ui/faq";
import { ShareButtons } from "@/components/ui/share-buttons";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";
import { getService, getServices } from "@/lib/content";
import { SERVICE_SEEDS } from "@/lib/catalog/services";
import { INTEGRATIONS } from "@/lib/catalog/integrations";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 300;
export function generateStaticParams() {
  return SERVICE_SEEDS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.short_description, path: `/services/${s.slug}` });
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, { items: all }] = await Promise.all([getService(slug), getServices()]);
  if (!s) notFound();
  const related = all.filter((x) => x.slug !== s.slug && x.category === s.category).slice(0, 3);
  const quote = `/start-project?service=${encodeURIComponent(s.title)}`;
  const book = "/contact";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Service", name: s.title, description: s.description || s.short_description,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, url: `${SITE_URL}/services/${s.slug}`,
  };
  const integ = (s.integrations ?? []).map((n) => INTEGRATIONS.find((i) => i.name === n) ?? { name: n, icon: "plug", group: "" });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="relative overflow-hidden pb-14 pt-32 sm:pt-40">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
        <div aria-hidden className="aurora absolute -top-10 right-0 h-80 w-80 rounded-full bg-neon/15 blur-[110px]" />
        <div className="container-page relative">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> All services</Link>
          <Reveal className="mt-6 max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="shine flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon to-cyan shadow-[0_0_50px_-10px_var(--color-neon)]"><ServiceIcon name={s.icon} className="h-8 w-8 text-onbrand" /></span>
              <p className="eyebrow">{s.category}</p>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">{s.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-soft">{s.description || s.short_description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={quote} size="lg">Get a Quote <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href={book} size="lg" variant="secondary"><Mail className="h-4 w-4" /> Ask a Question</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          {s.problem && (
            <Reveal className="rounded-2xl border border-warning/25 bg-warning/[.05] p-7">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-warning"><AlertTriangle className="h-4 w-4" /> The business problem</p>
              <p className="mt-3 leading-relaxed text-soft">{s.problem}</p>
            </Reveal>
          )}
          <Reveal className="rounded-2xl border border-neon/25 bg-neon/[.05] p-7" delay={0.05}>
            <p className="text-sm font-semibold uppercase tracking-wider text-neon">Business benefits</p>
            <ul className="mt-4 space-y-3">{s.benefits.map((b) => <li key={b} className="flex gap-3 text-soft"><Check className="mt-0.5 h-5 w-5 shrink-0 text-neon" />{b}</li>)}</ul>
          </Reveal>
        </div>

        {s.how_it_works?.length > 0 && (
          <Reveal className="card mt-6 p-7 sm:p-9">
            <h2 className="text-2xl font-semibold text-white">How the automation works</h2>
            <p className="mt-2 text-sm text-muted">Simplified workflow — every build is tailored to your tools.</p>
            <div className="mt-8"><WorkflowDiagram steps={s.how_it_works} /></div>
          </Reveal>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal className="card p-7">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><Lightbulb className="h-5 w-5 text-neon" /> Use cases</h2>
            {s.use_case && <p className="mt-4 rounded-xl border border-line bg-ink/50 p-4 text-sm leading-relaxed text-soft">{s.use_case}</p>}
            {s.use_cases?.length > 0 && <ul className="mt-4 space-y-2">{s.use_cases.map((u) => <li key={u} className="flex gap-3 text-sm text-soft"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />{u}</li>)}</ul>}
          </Reveal>
          <Reveal className="card p-7" delay={0.05}>
            <h2 className="text-xl font-semibold text-white">Capabilities</h2>
            <ul className="mt-4 flex flex-wrap gap-2">{s.features.map((f) => <li key={f} className="rounded-full border border-neon/25 bg-neon/[.06] px-3 py-1.5 text-xs text-neon">{f}</li>)}</ul>
            {integ.length > 0 && (
              <>
                <h3 className="mt-7 text-sm font-semibold text-white">Supported integrations</h3>
                <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {integ.map((i) => <li key={i.name} className="flex items-center gap-2 rounded-lg border border-line bg-ink/50 px-3 py-2 text-xs text-soft"><ServiceIcon name={i.icon} className="h-4 w-4 text-cyan" />{i.name}</li>)}
                </ul>
              </>
            )}
          </Reveal>
        </div>

        {s.faqs?.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-5 text-2xl font-semibold text-white">Frequently asked questions</h2>
            <Faq items={s.faqs} />
          </div>
        )}

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-neon/30 bg-gradient-to-br from-neon/10 to-cyan/5 p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Ready to automate with {s.title}?</h2>
            <p className="mt-1 text-sm text-muted">Get a tailored quote — we reply to every request by email.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={quote}>Get a Quote</ButtonLink>
            <ButtonLink href={book} variant="secondary">Ask a Question</ButtonLink>
          </div>
        </div>
        <div className="mt-8"><ShareButtons title={`${s.title} — Maaz AI Wala`} path={`/services/${s.slug}`} /></div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-5 text-xl font-semibold text-white">Related services</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}`} className="card card-hover flex items-center gap-4 p-5">
                  <ServiceIcon name={r.icon} className="h-6 w-6 text-neon" /><span className="font-medium text-white">{r.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
