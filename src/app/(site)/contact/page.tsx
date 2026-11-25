import { Mail, MapPin, Rocket } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { SocialLinks } from "@/components/layout/social-links";
import { ContactForm } from "@/components/forms/contact-form";
import { getServices, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Maaz AI Wala about AI automation, n8n workflows, AI agents or chatbots. Send a message or start your project.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, { items: services }] = await Promise.all([getSettings(), getServices()]);
  const c = settings.contact;
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let&apos;s talk about <span className="text-gradient">your automation</span></>} description={`Questions, ideas or a project in mind — send us a message. ${c.response_note}`} />
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm services={services.map((s) => s.title)} />
          <aside className="space-y-5">
            <div className="rounded-2xl border border-cyan/30 bg-cyan/[.05] p-6">
              <Mail className="h-6 w-6 text-cyan" />
              <h2 className="mt-3 font-semibold text-white">We work by email</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Every conversation — questions, quotations and project updates — happens by email, so you always have a written record. We don&apos;t do phone calls or meetings.
              </p>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-white">Contact details</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {c.email && <li className="flex gap-3"><Mail className="h-5 w-5 text-neon" /><a href={`mailto:${c.email}`} className="break-all text-soft hover:text-white">{c.email}</a></li>}
                {c.location && <li className="flex gap-3"><MapPin className="h-5 w-5 text-neon" /><span className="text-soft">{c.location}</span></li>}
                {!c.email && <li className="text-muted">Use the form — we reply to every enquiry by email.</li>}
              </ul>
            </div>
            <div className="rounded-2xl border border-neon/30 bg-neon/[.05] p-6">
              <Rocket className="h-6 w-6 text-neon" />
              <h2 className="mt-3 font-semibold text-white">Ready with a project?</h2>
              <p className="mt-1 text-sm text-muted">Share your full requirements and we will reply with a written quotation by email.</p>
              <ButtonLink href="/start-project" className="mt-5">Start Your Project</ButtonLink>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-white">Follow us</h2>
              <SocialLinks urls={settings.social} withLabels className="mt-4" />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
