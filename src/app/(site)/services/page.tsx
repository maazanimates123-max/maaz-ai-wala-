import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icon";
import { CtaBanner } from "@/components/home/sections";
import { getServices, getSettings } from "@/lib/content";
import { SERVICE_CATEGORIES } from "@/lib/catalog/services";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "AI Automation Services",
  description: "15 AI automation services: email, customer support, chatbots, lead generation & qualification, booking, social media, content, voice agents, CRM, invoices, documents, sales, marketing and custom AI agents.",
  path: "/services",
});

export default async function ServicesPage() {
  const [{ items: services }, settings] = await Promise.all([getServices(), getSettings()]);
  const cats = [...SERVICE_CATEGORIES, ...new Set(services.map((s) => s.category).filter((c) => c && !SERVICE_CATEGORIES.includes(c)))];
  return (
    <>
      <PageHero eyebrow="Services" title={<>AI automation services that <span className="text-gradient">do real work</span></>}
        description={`${services.length} services — each tailored to your process, tested on real scenarios and documented so you stay in control.`}>
        <ButtonLink href="/start-project" size="lg">Get a Quote <ArrowRight className="h-4 w-4" /></ButtonLink>
        <ButtonLink href="/contact" size="lg" variant="secondary">Contact Us</ButtonLink>
      </PageHero>
      <Section className="pt-0">
        <div className="space-y-14">
          {cats.map((cat) => {
            const list = services.filter((s) => (s.category || "Automation") === cat);
            if (!list.length) return null;
            return (
              <div key={cat}>
                <h2 className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[.18em] text-muted"><span className="h-px w-8 bg-neon" />{cat}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((s, i) => (
                    <Reveal key={s.slug} delay={(i % 3) * 0.05}>
                      <Link href={`/services/${s.slug}`} className="card card-hover group flex h-full flex-col p-6">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon/25 to-cyan/10 ring-1 ring-neon/30 transition group-hover:scale-105">
                          <ServiceIcon name={s.icon} className="h-6 w-6 text-neon" />
                        </span>
                        <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.short_description}</p>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neon">View details <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <CtaBanner cta={settings.cta} />
    </>
  );
}
