import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon } from "@/components/ui/icon";
import { CtaBanner } from "@/components/home/sections";
import { getSettings } from "@/lib/content";
import { INDUSTRIES } from "@/lib/catalog/industries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Industry Solutions",
  description: "AI automation for real estate, e-commerce, healthcare, education, agencies, restaurants, financial services, small businesses, corporates and recruitment.",
  path: "/solutions",
});

export default async function SolutionsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Industry solutions" title={<>Automation built for <span className="text-gradient">your industry</span></>}
        description="Every industry has its own repetitive bottlenecks. Explore the automation opportunities and workflows for yours." />
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.slug} delay={(i % 3) * 0.05}>
              <Link href={`/solutions/${ind.slug}`} className="card card-hover group flex h-full flex-col p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan/25 to-neon/10 ring-1 ring-cyan/30"><ServiceIcon name={ind.icon} className="h-6 w-6 text-cyan" /></span>
                <h2 className="mt-5 text-xl font-semibold text-white">{ind.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{ind.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-neon">Explore solutions <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBanner cta={settings.cta} />
    </>
  );
}
