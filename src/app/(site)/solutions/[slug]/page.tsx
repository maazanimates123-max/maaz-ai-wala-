import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, AlertTriangle, Zap } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icon";
import { ShareButtons } from "@/components/ui/share-buttons";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";
import { INDUSTRIES } from "@/lib/catalog/industries";
import { SERVICE_SEEDS } from "@/lib/catalog/services";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = INDUSTRIES.find((i) => i.slug === slug);
  return ind ? pageMetadata({ title: `AI Automation for ${ind.name}`, description: ind.tagline, path: `/solutions/${ind.slug}` }) : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = INDUSTRIES.find((i) => i.slug === slug);
  if (!ind) notFound();
  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-32 sm:pt-40">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
        <div aria-hidden className="aurora absolute -top-10 left-1/3 h-80 w-80 rounded-full bg-cyan/15 blur-[110px]" />
        <div className="container-page relative">
          <Link href="/solutions" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> All industries</Link>
          <Reveal className="mt-6 max-w-3xl">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-neon"><ServiceIcon name={ind.icon} className="h-8 w-8 text-onbrand" /></span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">AI automation for <span className="text-gradient">{ind.name}</span></h1>
            <p className="mt-5 text-lg leading-relaxed text-soft">{ind.tagline}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/start-project?industry=${encodeURIComponent(ind.name)}`} size="lg">Get a Quote <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="secondary">Contact Us</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
      <Section className="pt-0">
        <Reveal className="rounded-2xl border border-warning/25 bg-warning/[.05] p-7">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-warning"><AlertTriangle className="h-4 w-4" /> Common challenges</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{ind.challenges.map((c) => <li key={c} className="flex gap-3 text-soft"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />{c}</li>)}</ul>
        </Reveal>
        <h2 className="mb-5 mt-14 text-2xl font-semibold text-white">Automation opportunities</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ind.opportunities.map((o, i) => {
            const svc = SERVICE_SEEDS.find((s) => s.slug === o.service);
            return (
              <Reveal key={o.title} delay={(i % 2) * 0.05}>
                <div className="card card-hover h-full p-6">
                  <Zap className="h-5 w-5 text-neon" />
                  <h3 className="mt-3 font-semibold text-white">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{o.text}</p>
                  {svc && <Link href={`/services/${svc.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm text-neon hover:underline">{svc.title} <ArrowRight className="h-3.5 w-3.5" /></Link>}
                </div>
              </Reveal>
            );
          })}
        </div>
        <h2 className="mb-5 mt-14 text-2xl font-semibold text-white">Example workflows</h2>
        <div className="space-y-4">
          {ind.workflows.map((w) => (
            <Reveal key={w.title} className="card p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-white">{w.title}</h3><span className="rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-warning">Example</span></div>
              <WorkflowDiagram steps={w.steps} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><ShareButtons title={`AI automation for ${ind.name} — Maaz AI Wala`} path={`/solutions/${ind.slug}`} /></div>
      </Section>
    </>
  );
}
