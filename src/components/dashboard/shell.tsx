"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: React.ReactNode; exact?: boolean };

export function AppShell({ title, nav, user, extraLink, children }: {
  title: string; nav: NavItem[]; user: { email: string; name?: string | null }; extraLink?: { href: string; label: string }; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (n: NavItem) => (n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(`${n.href}/`));

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 px-5 py-5">
        <LogoMark className="h-8 w-8" />
        <span className="text-sm font-semibold text-white">Maaz <span className="text-neon">AI</span> Wala</span>
      </Link>
      <p className="px-5 pb-3 font-mono text-[10px] uppercase tracking-[.2em] text-muted">{title}</p>
      <nav aria-label={title} className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={active(n) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active(n) ? "bg-neon/10 text-neon ring-1 ring-neon/20" : "text-soft hover:bg-white/[.04] hover:text-white",
                )}
              >
                <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{n.icon}</span>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        {extraLink && (
          <Link href={extraLink.href} className="mt-4 flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm text-soft hover:text-white">
            <ExternalLink className="h-4 w-4" /> {extraLink.label}
          </Link>
        )}
      </nav>
      <div className="border-t border-line p-4">
        <p className="truncate text-sm text-white">{user.name || user.email}</p>
        {user.name && <p className="truncate text-xs text-muted">{user.email}</p>}
        <form action="/auth/signout" method="post" className="mt-3">
          <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted hover:bg-white/[.04] hover:text-white">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-line bg-ink lg:sticky lg:top-0 lg:block lg:h-dvh">{sidebar}</aside>
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-ink/90 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2"><LogoMark className="h-7 w-7" /><span className="text-sm font-semibold">{title}</span></Link>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} className="rounded-lg border border-line p-2"><Menu className="h-5 w-5" /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[300px] border-r border-line bg-ink">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="absolute right-3 top-4 rounded-lg p-2 text-muted"><X className="h-5 w-5" /></button>
            {sidebar}
          </div>
        </div>
      )}
      <main id="main" className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
