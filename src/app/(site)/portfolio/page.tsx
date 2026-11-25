import { FlaskConical } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CtaBanner } from "@/components/home/sections";
import { PortfolioGallery } from "@/components/portfolio/gallery";
import { getPortfolio, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Portfolio & Case Studies",
  description: "AI automation projects by Maaz AI Wala: support agents, lead management, email assistants, invoice extraction, content workflows and reporting automation.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [{ items }, settings] = await Promise.all([getPortfolio(), getSettings()]);
  return (
    <>
      <PageHero eyebrow="Portfolio" title={<>Automation systems we <span className="text-gradient">design &amp; build</span></>}
        description="Filter by category and open any project for the full case study: problem, solution, workflow and technology." />
      <Section className="pt-0">
        {items.some((p) => p.is_demo) && (
          <Reveal className="mx-auto mb-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-warning/25 bg-warning/[.06] p-4 text-sm text-soft">
            <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p>Projects marked <strong className="text-warning">Own build</strong> are real n8n workflows we built for our own channels. They are not client case studies, so no client results are claimed.</p>
          </Reveal>
        )}
        <PortfolioGallery items={items} />
      </Section>
      <CtaBanner cta={settings.cta} />
    </>
  );
}
