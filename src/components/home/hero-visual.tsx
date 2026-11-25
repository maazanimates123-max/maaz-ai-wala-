"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Bot, Mail, Database, MessageSquare, Target, FileText, Sparkles, CheckCircle2 } from "lucide-react";

const AiCoreScene = dynamic(() => import("@/components/home/ai-core-scene"), { ssr: false, loading: () => null });

const NODES = [
  { icon: Mail, label: "Email" },
  { icon: Target, label: "Leads" },
  { icon: Database, label: "CRM" },
  { icon: FileText, label: "Invoices" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Bot, label: "AI Agent" },
].map((n, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { ...n, x: +(50 + 40 * Math.cos(a)).toFixed(2), y: +(50 + 40 * Math.sin(a)).toFixed(2), i, z: 40 + (i % 3) * 25 };
});

/** Illustrative event feed — clearly a demo animation, not live client data. */
const EVENTS = [
  "Lead scored HOT · 86/100",
  "Reply drafted for approval",
  "Invoice INV-2041 extracted",
  "CRM contact updated",
  "Support ticket answered",
  "Weekly report sent",
];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "flat">("pending");
  const [lite, setLite] = useState(false);
  const [visible, setVisible] = useState(true);
  const [event, setEvent] = useState(0);

  // 3D tilt of the whole composition following the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    const id = requestAnimationFrame(() => {
      setLite(narrow || lowCores);
      setMode(!reduce && hasWebGL() ? "3d" : "flat");
    });
    return () => cancelAnimationFrame(id);
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible) return;
    const t = setInterval(() => setEvent((e) => (e + 1) % EVENTS.length), 2400);
    return () => clearInterval(t);
  }, [reduce, visible]);

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-[640px] [perspective:1200px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className="absolute inset-0">
        <div aria-hidden className="absolute inset-[10%] animate-pulse-slow rounded-full bg-gradient-to-br from-neon/25 to-cyan/15 blur-[90px]" />

        {mode === "3d" && (
          <div className="absolute inset-0" style={{ transform: "translateZ(0px)" }}>
            <AiCoreScene lite={lite} paused={!visible} />
          </div>
        )}

        {/* Workflow connections (motion graphics layer) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          {mode !== "3d" && (
            <>
              <g style={{ transformOrigin: "50px 50px" }} className="animate-[spin_70s_linear_infinite]">
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-neon)" strokeOpacity=".18" strokeWidth=".25" strokeDasharray="1 2.2" />
              </g>
              <g style={{ transformOrigin: "50px 50px" }} className="animate-[spin_45s_linear_infinite_reverse]">
                <circle cx="50" cy="50" r="27" fill="none" stroke="var(--color-neon)" strokeOpacity=".22" strokeWidth=".25" />
              </g>
            </>
          )}
          {NODES.map((n) => (
            <g key={n.label}>
              <line x1="50" y1="50" x2={n.x} y2={n.y} stroke="var(--color-neon)" strokeOpacity=".22" strokeWidth=".25" strokeDasharray="1 1.2" className="animate-flow" />
              <circle r=".9" fill="var(--color-cyan)" className="packet" style={{ filter: "drop-shadow(0 0 1.5px var(--color-cyan))" }}>
                <animateMotion dur={`${2.2 + n.i * 0.35}s`} begin={`${n.i * 0.4}s`} repeatCount="indefinite" path={`M50,50 L${n.x},${n.y}`} />
              </circle>
              <circle r=".7" fill="var(--color-neon)" className="packet">
                <animateMotion dur={`${3 + n.i * 0.3}s`} begin={`${n.i * 0.7}s`} repeatCount="indefinite" path={`M${n.x},${n.y} L50,50`} />
              </circle>
            </g>
          ))}
        </svg>

        {/* Flat fallback hub (no WebGL / reduced motion) */}
        {mode === "flat" && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span aria-hidden className="absolute inset-0 -m-6 animate-ping rounded-full border border-neon/40 [animation-duration:3s]" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-neon to-cyan shadow-[0_0_60px_-4px_var(--color-neon)]">
              <Sparkles className="h-10 w-10 text-onbrand" />
            </div>
          </div>
        )}

        {/* Floating workflow chips at different depths */}
        {NODES.map((n) => (
          <div key={n.label} style={{ left: `${n.x}%`, top: `${n.y}%`, transform: `translate(-50%, -50%) translateZ(${n.z}px)` }} className="absolute">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + n.i * 0.12, type: "spring", stiffness: 160, damping: 14 }}
              className="glass flex animate-float items-center gap-2 rounded-2xl px-3 py-2.5 shadow-[0_8px_30px_-10px_var(--color-neon)]"
              style={{ animationDelay: `${-n.i * 1.1}s` }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-neon/30 to-cyan/20"><n.icon className="h-4 w-4 text-neon" /></span>
              <span className="hidden text-xs font-medium text-white sm:inline">{n.label}</span>
            </motion.div>
          </div>
        ))}

        {/* Live-style event feed (demo animation) */}
        <div className="absolute bottom-[1%] left-0 w-[min(40%,250px)] max-sm:hidden" style={{ transform: "translateZ(80px)" }}>
          <div className="glass overflow-hidden rounded-2xl px-4 py-3 shadow-[0_20px_50px_-20px_var(--color-neon)]">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[.18em] text-muted">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-neon" /></span>
                Automation activity
              </span>
              <span className="font-mono">demo</span>
            </div>
            <div className="relative mt-2 h-5 overflow-hidden" aria-hidden>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={event} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.35 }}
                  className="flex items-center gap-2 truncate text-[13px] text-white">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan" />{EVENTS[event]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="sr-only">Animated 3D illustration of an AI core connecting email, leads, CRM, invoices, chat and AI agent workflows.</p>
    </div>
  );
}
