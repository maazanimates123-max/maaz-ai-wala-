import { Hero, Marquee, ServicesGrid, ProcessSteps, SocialSection, CtaBanner } from "@/components/home/sections";
import { Stats, FeaturedProjects, IntegrationsGrid, Testimonials, DemoTeaser, YouTubeSection, PricingPreview } from "@/components/home/extras";
import { getPortfolio, getPricing, getServices, getSettings, getTestimonials } from "@/lib/content";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, { items: services }, { items: portfolio }, testimonials, { items: pricing }] = await Promise.all([
    getSettings(),
    getServices(),
    getPortfolio(),
    getTestimonials(),
    getPricing(),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-mark-512.png`,
    description: DEFAULT_DESCRIPTION,
    slogan: "Automate. Create. Grow.",
    areaServed: "Worldwide",
    sameAs: Object.values(settings.social).filter(Boolean),
    knowsAbout: ["AI Automation", "n8n", "AI Agents", "AI Chatbots", "Workflow Automation"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI automation services",
      itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: `${SITE_URL}/services/${s.slug}` } })),
    },
    ...(settings.contact.email ? { email: settings.contact.email } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero hero={settings.hero} social={settings.social} />
      <Marquee />
      <Stats services={services.length} />
      <DemoTeaser />
      <ServicesGrid services={services} />
      <FeaturedProjects items={portfolio} />
      <ProcessSteps />
      <PricingPreview items={pricing} />
      <IntegrationsGrid />
      {testimonials.length > 0 && <Testimonials items={testimonials} />}
      <YouTubeSection video={settings.media.youtube_video} channel={settings.social.youtube} />
      <SocialSection social={settings.social} />
      <CtaBanner cta={settings.cta} />
    </>
  );
}
