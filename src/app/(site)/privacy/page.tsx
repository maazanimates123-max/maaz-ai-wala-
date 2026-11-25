import { PageHero, Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy", description: "How Maaz AI Wala collects, uses and protects your information.", path: "/privacy" });
const UPDATED = "21 November 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" description={`Last updated: ${UPDATED}`} />
      <Section className="pt-0">
        <article className="prose-site mx-auto max-w-3xl">
          <p>This Privacy Policy explains how Maaz AI Wala (&quot;we&quot;, &quot;us&quot;) collects, uses and protects information when you use this website, its forms and our AI assistant.</p>
          <h2>Information we collect</h2>
          <ul>
            <li><strong>Contact information:</strong> your name and email address, and a phone number only if you choose to give one (optional — we communicate by email).</li>
            <li><strong>Project information:</strong> details you submit in the project form, such as your name, business details, requirements, budget range and timeline.</li>
            <li><strong>Messages:</strong> contact form messages, support requests and messages you send to the website AI assistant.</li>
            <li><strong>Payment records:</strong> amounts, status and transaction references you provide. We do not store card numbers or banking passwords.</li>
            <li><strong>Technical data:</strong> basic request information (such as IP address) used temporarily for security and rate limiting.</li>
          </ul>
          <h2>How we use information</h2>
          <ul>
            <li>To respond to enquiries, review projects and prepare quotations.</li>
            <li>To provide and manage the services you request, including project updates and support.</li>
            <li>To operate the AI assistant and improve the quality of its answers.</li>
            <li>To protect the website from spam, abuse and unauthorised access.</li>
          </ul>
          <h2>AI assistant and automation processing</h2>
          <p>Messages sent to the AI assistant and project submissions are processed by our automation workflows (hosted on n8n) and may be processed by third-party AI model providers to generate responses or qualify enquiries. Please do not share passwords, payment details or other sensitive personal data in the chat.</p>
          <h2>Service providers</h2>
          <p>We use trusted providers to run this website, including hosting, database and authentication (Supabase), workflow automation (n8n), email delivery and AI model providers. They process data only to provide their services to us.</p>
          <h2>Data security</h2>
          <p>Access to private data is restricted. Each client can only access their own projects, quotations and messages. Secrets and API keys are kept on the server and never exposed in the browser.</p>
          <h2>Data retention</h2>
          <p>We keep project and account information for as long as needed to provide our services and meet legal or accounting obligations. You can ask us to delete your account and associated data.</p>
          <h2>Your rights</h2>
          <p>You can request access to, correction of, or deletion of your personal information by contacting us through the <a href="/contact">contact page</a>.</p>
          <h2>Cookies</h2>
          <p>We use only essential storage needed to run and secure the website. The AI assistant stores your conversation in your browser&apos;s local storage so it persists between pages; you can clear it at any time by starting a new conversation.</p>
          <h2>Changes</h2>
          <p>We may update this policy from time to time. The date above shows when it was last changed.</p>
        </article>
      </Section>
    </>
  );
}
