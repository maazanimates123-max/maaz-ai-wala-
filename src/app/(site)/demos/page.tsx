import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { WorkflowSimulator } from "@/components/demos/simulator";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Interactive Automation Demos",
  description: "Run interactive AI automation workflow simulations: lead qualification, AI email replies, invoice extraction and appointment booking.",
  path: "/demos",
});

export default function DemosPage() {
  return (
    <>
      <PageHero eyebrow="Interactive demos" title={<>Watch an automation <span className="text-gradient">run step by step</span></>}
        description="Pick a scenario and press Run. See the trigger fire, data move between nodes, the AI respond and the final output. These are simulations with sample data — no real systems are called." />
      <Section className="pt-0">
        <WorkflowSimulator />
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-soft">Want this running on your real data?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/start-project">Get Started <ArrowRight className="h-4 w-4" /></ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Contact Us</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
