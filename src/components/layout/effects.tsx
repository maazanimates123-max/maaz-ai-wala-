"use client";
import { useEffect } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Thin purple→cyan reading-progress bar at the top of every marketing page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-neon to-cyan" />;
}

/** Feeds the pointer position to `.card-hover` elements for the spotlight glow (one listener for the whole page). */
export function Spotlight() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".card-hover") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);
  return null;
}

/** Headline that reveals word by word; the last `highlight` words get the brand gradient. */
export function AnimatedHeading({ text, highlight = 2, className }: { text: string; highlight?: number; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <h1 className={className} aria-label={text}>
      {words.map((w, i) => {
        const hl = i >= words.length - highlight;
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block ${hl ? "text-gradient" : ""}`}
              initial={reduce ? false : { y: "105%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </h1>
  );
}
