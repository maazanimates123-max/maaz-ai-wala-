import { Search, ClipboardList, Network, Code2, FlaskConical, Rocket, LifeBuoy } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { WorkflowDiagram } from "@/components/home/workflow-diagram";
import { CtaBanner } from "@/components/home/sections";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "How It Works",
  description: "Our seven-step automation process: discovery, planning, architecture, development, testing, deployment and support.",
  path: "/how-it-works",
});

const steps = [
  { icon: Search, title: "Discovery", text: "We understand the business and its requirements — your goals, your team, your tools and where time is being lost.", out: "Clear problem statement" },
  { icon: ClipboardList, title: "Planning", text: "We identify repetitive processes and automation opportunities, and prioritise them by impact and effort.", out: "Prioritised automation plan" },
  { icon: Network, title: "Architecture", text: "We design the workflow, integrations and AI logic — including data flow, approvals and failure handling.", out: "Workflow & integration design" },
  { icon: Code2, title: "Development", text: "We build the automation system in n8n and connected tools, following the agreed design.", out: "Working automation" },
  { icon: FlaskConical, title: "Testing", text: "We test the workflow with real scenarios, edge cases, errors and data handling before anything goes live.", out: "Tested, validated system" },
  { icon: Rocket, title: "Deployment", text: "We deploy the solution, configure production integrations and credentials on your accounts, and hand over documentation.", out: "Live system + documentation" },
  { icon: LifeBuoy, title: "Support", text: "We provide maintenance and improvements according to the agreed service, so the system keeps up with your business.", out: "Ongoing reliability" },
];

export default async function HowItWorksPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="How it works" title={<>A clear process from <span className="text-gradient">idea to live system</span></>}
        description="No black boxes. You know what is being built, why, and how it will be tested before it touches your real data." />
      <Section className="pt-0">
        <Reveal className="card mb-16 p-6 sm:p-8">
          <p className="mb-5 text-sm text-muted">The journey at a glance</p>
          <WorkflowDiagram steps={steps.map((s) => s.title)} />
        </Reveal>
        <div className="relative mx-auto max-w-4xl">
          <div aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-neon/60 via-neon/20 to-transparent sm:left-[31px]" />
          <ol className="relative">
          {steps.map((s, i) => (
            <li key={s.title} className="relative pb-10 pl-20 last:pb-0 sm:pl-24">
              <span className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-neon/40 bg-base shadow-[0_0_30px_-10px_#a78bfa] sm:h-16 sm:w-16">
                <s.icon className="h-6 w-6 text-neon" />
              </span>
              <Reveal className="card p-6 sm:p-7">
                <p className="font-mono text-xs text-neon">STEP {i + 1}</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{s.title}</h2>
                <p className="mt-3 leading-relaxed text-soft">{s.text}</p>
                <p className="mt-4 inline-flex rounded-full border border-line bg-ink/60 px-3 py-1 text-xs text-muted">Outcome: <span className="ml-1 text-white">{s.out}</span></p>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </Section>
      <Section className="bg-ink/40">
        <SectionHeading eyebrow="What you can expect" title="Built for trust" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Human-in-the-loop", "Important actions such as sending emails or changing records can require your approval."],
            ["Error handling", "Workflows include validation, retries and alerts so failures are noticed, not hidden."],
            ["Your accounts, your data", "Systems run on accounts you own. Credentials are configured securely, never shared publicly."],
          ].map(([t, d]) => (
            <div key={t} className="card p-6"><h3 className="font-semibold text-white">{t}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{d}</p></div>
          ))}
        </div>
      </Section>
      <CtaBanner cta={settings.cta} />
    </>
  );
}
