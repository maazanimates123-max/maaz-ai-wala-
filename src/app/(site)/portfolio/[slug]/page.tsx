import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, AlertTriangle, Lightbulb, BadgeCheck, FlaskConical, Trophy } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ShareButtons } from "@/components/ui/share-buttons";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";
import { getPortfolio, getPortfolioItem } from "@/lib/content";
import { defaultPortfolio } from "@/lib/defaults";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export function generateStaticParams() {
  return defaultPortfolio.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPortfolioItem((await params).slug);
  return p ? pageMetadata({ title: `${p.title} — Case Study`, description: p.summary || p.problem, path: `/portfolio/${p.slug}` }) : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, { items }] = await Promise.all([getPortfolioItem(slug), getPortfolio()]);
  if (!p) notFound();
  const more = items.filter((x) => x.slug !== p.slug).slice(0, 3);
  const inquiry = `/start-project?service=${encodeURIComponent(p.category)}&ref=${encodeURIComponent(p.slug)}`;
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
        <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
        <div className="container-page relative">
          <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft className="h-4 w-4" /> Portfolio</Link>
          <Reveal className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-neon/10 px-3 py-1 text-xs text-neon">{p.category}</span>
              {p.is_demo
                ? <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-warning"><FlaskConical className="h-3 w-3" />Own build</span>
                : <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon"><BadgeCheck className="h-3 w-3" />Client project</span>}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{p.title}</h1>
            {p.summary && <p className="mt-5 text-lg leading-relaxed text-soft">{p.summary}</p>}
          </Reveal>
        </div>
      </section>
      <Section className="pt-0">
        {p.image_url && (
          <Reveal className="relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl border border-line">
            <Image src={p.image_url} alt={`${p.title} screenshot`} fill priority sizes="(min-width:1280px) 1200px, 100vw" className="object-contain bg-ink p-3" />
          </Reveal>
        )}
        {p.is_demo && <p className="mb-8 rounded-xl border border-warning/25 bg-warning/[.06] p-4 text-sm text-soft">This is a real workflow built by Maaz AI Wala as its own project. It is not a client engagement and no client results are claimed.</p>}
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-warning/25 bg-warning/[.05] p-7">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-warning"><AlertTriangle className="h-4 w-4" /> Problem</h2>
            <p className="mt-3 leading-relaxed text-soft">{p.problem}</p>
          </Reveal>
          <Reveal className="rounded-2xl border border-neon/25 bg-neon/[.05] p-7" delay={0.05}>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neon"><Lightbulb className="h-4 w-4" /> Solution</h2>
            <p className="mt-3 leading-relaxed text-soft">{p.solution}</p>
          </Reveal>
        </div>
        {p.workflow_steps?.length > 0 && (
          <Reveal className="card mt-6 p-7 sm:p-9">
            <h2 className="text-xl font-semibold text-white">Workflow</h2>
            <div className="mt-6"><WorkflowDiagram steps={p.workflow_steps} /></div>
          </Reveal>
        )}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal className="card p-7">
            <h2 className="text-xl font-semibold text-white">Technologies used</h2>
            <ul className="mt-4 flex flex-wrap gap-2">{p.technologies.map((t) => <li key={t} className="rounded-lg border border-line bg-ink/70 px-3 py-1.5 font-mono text-xs text-soft">{t}</li>)}</ul>
          </Reveal>
          {p.result && (
            <Reveal className="card p-7" delay={0.05}>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-white"><Trophy className="h-5 w-5 text-neon" /> {p.is_demo ? "What it does" : "Verified result"}</h2>
              <p className="mt-4 leading-relaxed text-soft">{p.result}</p>
            </Reveal>
          )}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-neon/30 bg-gradient-to-br from-neon/10 to-cyan/5 p-8 sm:flex-row sm:items-center">
          <div><h2 className="text-xl font-semibold text-white">Want something like this?</h2><p className="mt-1 text-sm text-muted">Tell us about your process and we&apos;ll tailor it to your business.</p></div>
          <div className="flex flex-wrap gap-3"><ButtonLink href={inquiry}>Inquire about this project <ArrowRight className="h-4 w-4" /></ButtonLink><ButtonLink href="/contact" variant="secondary">Email us</ButtonLink></div>
        </div>
        <div className="mt-8"><ShareButtons title={`${p.title} — Maaz AI Wala`} path={`/portfolio/${p.slug}`} /></div>
        {more.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-5 text-xl font-semibold text-white">More projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {more.map((m) => <Link key={m.slug} href={`/portfolio/${m.slug}`} className="card card-hover p-5"><p className="text-xs text-neon">{m.category}</p><p className="mt-1 font-medium text-white">{m.title}</p></Link>)}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
