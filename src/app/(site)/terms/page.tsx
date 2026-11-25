import { PageHero, Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms and Conditions", description: "Terms and conditions for using the Maaz AI Wala website and services.", path: "/terms" });
const UPDATED = "21 November 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms and Conditions" description={`Last updated: ${UPDATED}`} />
      <Section className="pt-0">
        <article className="prose-site mx-auto max-w-3xl">
          <p>By using this website or engaging Maaz AI Wala for services, you agree to these terms.</p>
          <h2>Services</h2>
          <p>Maaz AI Wala provides AI automation, workflow automation, AI agent and chatbot development and related consulting. The exact scope, deliverables, timeline and price of each project are defined in a written quotation that we send and you accept by email.</p>
          <h2>Quotations and payment</h2>
          <ul>
            <li>Website pricing packages are indicative. Only an accepted quotation is binding.</li>
            <li>Work begins once a quotation is accepted and the agreed payment is verified.</li>
            <li>Payments are marked as paid only after we verify receipt.</li>
            <li>Third-party costs (for example n8n, AI model usage or software subscriptions) are your responsibility unless stated in the quotation.</li>
          </ul>
          <h2>Your responsibilities</h2>
          <ul>
            <li>Provide accurate information and the access needed to build and test the automation.</li>
            <li>Ensure you have the right to use the data, accounts and platforms connected to your automation.</li>
            <li>Review and approve automations before they are used in production.</li>
          </ul>
          <h2>AI-generated output</h2>
          <p>AI systems can make mistakes. Automations that generate text, classifications or decisions should be monitored, and important actions should include human review. The website AI assistant provides general information only and does not create binding offers.</p>
          <h2>Intellectual property</h2>
          <p>Unless otherwise agreed in the quotation, once full payment is received you own the workflows and configurations built specifically for you. We may reuse general know-how, techniques and non-confidential components.</p>
          <h2>Support</h2>
          <p>Support and maintenance are provided for the period and scope stated in your quotation.</p>
          <h2>Limitation of liability</h2>
          <p>To the extent permitted by law, Maaz AI Wala is not liable for indirect or consequential losses, or for outages and changes in third-party platforms and APIs outside our control.</p>
          <h2>Acceptable use</h2>
          <p>You must not misuse this website, attempt to access other users&apos; data, submit spam, or use our services for unlawful purposes.</p>
          <h2>Contact</h2>
          <p>Questions about these terms can be sent through the <a href="/contact">contact page</a>.</p>
        </article>
      </Section>
    </>
  );
}
