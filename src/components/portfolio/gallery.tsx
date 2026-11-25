"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, FlaskConical } from "lucide-react";
import type { PortfolioProject } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PortfolioGallery({ items }: { items: PortfolioProject[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((p) => p.category)))], [items]);
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? items : items.filter((p) => p.category === cat);
  return (
    <>
      <div role="tablist" aria-label="Filter projects by category" className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={cn("rounded-full border px-4 py-2 text-sm transition", cat === c ? "border-transparent bg-gradient-to-r from-neon to-cyan text-onbrand" : "border-line text-soft hover:border-line-strong hover:text-white")}>
            {c}
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.article key={p.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}
              className="card card-hover group flex flex-col overflow-hidden">
              <Link href={`/portfolio/${p.slug}`} className="relative block aspect-[16/9] overflow-hidden border-b border-line bg-ink" aria-label={`${p.title} case study`}>
                {p.image_url ? (
                  <Image src={p.image_url} alt={`${p.title} screenshot`} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-contain p-2 transition duration-500 group-hover:scale-105" />
                ) : (
                  <div aria-hidden className="absolute inset-0 grid-bg">
                    <div className="absolute inset-0 flex items-center justify-center gap-2 px-4">
                      {(p.workflow_steps?.length ? p.workflow_steps : ["Trigger", "AI", "Action"]).slice(0, 4).map((s, i, a) => (
                        <span key={s} className="flex items-center gap-2">
                          <span className={cn("rounded-lg border px-2 py-1.5 text-[10px] text-white", i === 0 ? "border-neon bg-neon/20" : "border-neon/30 bg-surface")}>{s}</span>
                          {i < a.length - 1 && <ArrowRight className="h-3 w-3 shrink-0 text-neon" />}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur">{p.category}</span>
                {p.is_demo ? (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-warning/40 bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-warning backdrop-blur"><FlaskConical className="h-3 w-3" />Own build</span>
                ) : (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-neon/40 bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon backdrop-blur"><BadgeCheck className="h-3 w-3" />Client</span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-lg font-semibold text-white">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary || p.problem}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {p.technologies.slice(0, 4).map((t) => <li key={t} className="rounded-md border border-line bg-ink/70 px-2 py-1 font-mono text-[11px] text-soft">{t}</li>)}
                </ul>
                <Link href={`/portfolio/${p.slug}`} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-neon">Read case study <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
