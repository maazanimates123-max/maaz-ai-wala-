import { ChevronDown } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="divide-y divide-line rounded-2xl border border-line">
        {items.map((i) => (
          <details key={i.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
              {i.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-neon transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-soft">{i.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
