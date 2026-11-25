import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { BrandName, LogoMark } from "@/components/layout/logo";
import { SocialLinks } from "@/components/layout/social-links";
import { getServices, getSettings } from "@/lib/content";

export async function Footer() {
  const [settings, { items: services }] = await Promise.all([getSettings(), getServices()]);
  const year = new Date().getFullYear();
  const company = [
    { href: "/about", label: "About" },
    { href: "/solutions", label: "Solutions" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/demos", label: "Interactive Demos" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <footer className="relative border-t border-line bg-ink">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-11 w-11" />
            <span className="font-semibold text-white"><BrandName name={settings.brand.name} /></span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{settings.footer.description}</p>
          <SocialLinks urls={settings.social} className="mt-6" />
        </div>
        <nav aria-label="Company">
          <h2 className="text-sm font-semibold text-white">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {company.map((l) => (
              <li key={l.href}><Link className="text-muted hover:text-neon transition-colors" href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Services">
          <h2 className="text-sm font-semibold text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.slice(0, 7).map((s) => (
              <li key={s.slug}><Link className="text-muted hover:text-neon transition-colors" href={`/services/${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold text-white">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {settings.contact.email && (
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 text-neon" /><a className="hover:text-white break-all" href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></li>
            )}
            {settings.contact.location && (
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-neon" />{settings.contact.location}</li>
            )}
            <li className="text-xs leading-relaxed">We reply by email Mon–Sat (PKT), usually within 1–2 business days.</li>
            <li><Link href="/contact" className="text-neon hover:underline underline-offset-4">Send us a message →</Link></li>
          </ul>
        </div>
      </div>
      <div aria-hidden className="container-page select-none overflow-hidden pb-6">
        <p className="text-gradient whitespace-nowrap text-center text-[7.6vw] font-semibold leading-tight tracking-[-0.05em] opacity-25 xl:text-[6.4rem]">Automate. Create. Grow.</p>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.brand.name}. {settings.brand.tagline}</p>
          <ul className="flex gap-5">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
