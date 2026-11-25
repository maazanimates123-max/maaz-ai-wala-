"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/icon";
import { SERVICE_SEEDS } from "@/lib/catalog/services";
import { INDUSTRIES } from "@/lib/catalog/industries";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string; icon?: string; desc?: string };
const SERVICES: Item[] = SERVICE_SEEDS.map((s) => ({ href: `/services/${s.slug}`, label: s.title, icon: s.icon }));
const SOLUTIONS: Item[] = INDUSTRIES.map((i) => ({ href: `/solutions/${i.slug}`, label: i.name, icon: i.icon }));

const LINKS: { href: string; label: string; menu?: { items: Item[]; all: Item; cols: string } }[] = [
  { href: "/services", label: "Services", menu: { items: SERVICES, all: { href: "/services", label: "All services" }, cols: "lg:grid-cols-3 w-[760px]" } },
  { href: "/solutions", label: "Solutions", menu: { items: SOLUTIONS, all: { href: "/solutions", label: "All industries" }, cols: "lg:grid-cols-2 w-[520px]" } },
  { href: "/demos", label: "Demos" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Dropdown({ link, active }: { link: (typeof LINKS)[number]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);
  const menu = link.menu!;
  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => { clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setOpen(false), 120); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn("flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-colors", active ? "text-neon" : "text-soft hover:text-white")}
      >
        {link.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
          >
            <div className={cn("glass rounded-2xl p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)]", menu.cols, "grid gap-1")}>
              {menu.items.map((it) => (
                <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-soft transition hover:bg-neon/10 hover:text-white">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neon/10 ring-1 ring-neon/20"><ServiceIcon name={it.icon ?? "sparkles"} className="h-4 w-4 text-neon" /></span>
                  {it.label}
                </Link>
              ))}
              <Link href={menu.all.href} onClick={() => setOpen(false)} className="col-span-full mt-1 flex items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm text-neon hover:bg-neon/5">
                {menu.all.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Navbar({ brandName }: { brandName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neon focus:px-4 focus:py-2 focus:text-onbrand">Skip to content</a>
      <div className={cn("transition-all duration-300", scrolled || open ? "glass border-x-0 border-t-0" : "border-b border-transparent")}>
        <nav aria-label="Main" className="container-page flex h-[72px] items-center justify-between gap-4">
          <Logo name={brandName} />
          <ul className="hidden items-center gap-0.5 xl:flex">
            {LINKS.map((l) =>
              l.menu ? (
                <Dropdown key={l.href} link={l} active={isActive(l.href)} />
              ) : (
                <li key={l.href}>
                  <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
                    className={cn("relative rounded-full px-3 py-2 text-sm transition-colors", isActive(l.href) ? "text-neon" : "text-soft hover:text-white")}>
                    {l.label}
                    {isActive(l.href) && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-neon shadow-[0_0_10px_var(--color-neon)]" />}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/start-project" size="sm" className="max-[380px]:hidden">Get Started</ButtonLink>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-white xl:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-base xl:hidden">
            <ul className="container-page flex flex-col py-4">
              <li><Link href="/" className={cn("flex border-b border-line py-4 text-lg", pathname === "/" ? "text-neon" : "text-white")}>Home</Link></li>
              {LINKS.map((l) => (
                <li key={l.href} className="border-b border-line">
                  {l.menu ? (
                    <>
                      <button type="button" aria-expanded={expanded === l.href} onClick={() => setExpanded(expanded === l.href ? null : l.href)}
                        className={cn("flex w-full items-center justify-between py-4 text-lg", isActive(l.href) ? "text-neon" : "text-white")}>
                        {l.label}<ChevronDown className={cn("h-5 w-5 transition-transform", expanded === l.href && "rotate-180")} />
                      </button>
                      {expanded === l.href && (
                        <ul className="grid gap-1 pb-4 sm:grid-cols-2">
                          {[l.menu.all, ...l.menu.items].map((it) => (
                            <li key={it.href}><Link href={it.href} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-soft hover:text-white">
                              {it.icon ? <ServiceIcon name={it.icon} className="h-4 w-4 text-neon" /> : <ArrowRight className="h-4 w-4 text-neon" />}{it.label}</Link></li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={cn("flex py-4 text-lg", isActive(l.href) ? "text-neon" : "text-white")}>{l.label}</Link>
                  )}
                </li>
              ))}
              <li className="mt-6 grid gap-3">
                <ButtonLink href="/start-project" size="lg">Get Started</ButtonLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
