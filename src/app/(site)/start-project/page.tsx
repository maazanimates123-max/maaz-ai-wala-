import { Clock, FileText, ShieldCheck } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { ProjectForm } from "@/components/forms/project-form";
import { getServices } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "Start Your Project",
  description: "Tell Maaz AI Wala about your business and the automation you need. No account required.",
  path: "/start-project",
});

export default async function StartProjectPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { items: services } = await getServices();
  const notes = sp.package ? `I'm interested in the ${sp.package} package. ` : undefined;
  return (
    <>
      <PageHero eyebrow="Start your project" title={<>Tell us what you want to <span className="text-gradient">automate</span></>}
        description="The more detail you share, the more accurate our recommendation and quotation will be. No account needed." />
      <Section className="pt-0">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.7fr_1fr]">
          <ProjectForm services={services.map((s) => s.title)} defaults={{ service: sp.service, industry: sp.industry, notes }} />
          <aside className="space-y-4">
            {[
              { icon: FileText, t: "What happens next", d: "We review your requirements, may ask a few questions, and send you a quotation by email." },
              { icon: Clock, t: "Response time", d: "We aim to review new projects within 1–2 business days." },
              { icon: ShieldCheck, t: "Your information is private", d: "Project details are only seen by the Maaz AI Wala team." },
            ].map((x) => (
              <div key={x.t} className="card p-6"><x.icon className="h-6 w-6 text-neon" /><h2 className="mt-3 font-semibold text-white">{x.t}</h2><p className="mt-1 text-sm leading-relaxed text-muted">{x.d}</p></div>
            ))}
          </aside>
        </div>
      </Section>
    </>
  );
}
