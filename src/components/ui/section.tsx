import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("mb-12 sm:mb-16 max-w-3xl", align === "center" ? "mx-auto text-center" : "")}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <As className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.1] text-white text-balance">
        {title}
      </As>
      {description && <p className="mt-5 text-base sm:text-lg text-soft leading-relaxed text-pretty">{description}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24">
      <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
      <div aria-hidden className="absolute left-1/2 top-24 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-neon/10 blur-[110px]" />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white text-balance">{title}</h1>
          {description && <p className="mt-6 text-lg text-soft leading-relaxed text-pretty">{description}</p>}
          {children && <div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
