"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, Loader2, Zap, Brain, GitBranch, Send, Clock, Sparkles } from "lucide-react";
import { ServiceIcon } from "@/components/ui/icon";
import { SCENARIOS, type DemoNode } from "@/components/demos/scenarios";
import { cn } from "@/lib/utils";

const kindIcon = { trigger: Zap, ai: Brain, logic: GitBranch, action: Send } as const;
const kindLabel = { trigger: "Trigger", ai: "AI", logic: "Logic", action: "Action" } as const;

export function WorkflowSimulator() {
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const sc = SCENARIOS.find((s) => s.id === sid)!;
  const [step, setStep] = useState(-1); // -1 idle, n = running node n, nodes.length = done
  const [log, setLog] = useState<string[]>([]);
  const [view, setView] = useState<"after" | "before">("after");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = step >= 0 && step < sc.nodes.length;
  const done = step === sc.nodes.length;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const reset = () => {
    clear();
    setStep(-1);
    setLog([]);
  };
  const select = (id: string) => {
    reset();
    setSid(id);
  };
  const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
  const run = () => {
    reset();
    let t = 0;
    setStep(0);
    setLog([`[${stamp()}] ▶ Execution started — trigger: ${sc.trigger}`]);
    sc.nodes.forEach((n: DemoNode, i) => {
      t += n.ms;
      timers.current.push(
        setTimeout(() => {
          setLog((l) => [...l, `[${stamp()}] ✓ ${n.name} — ${n.output}`]);
          setStep(i + 1);
          if (i === sc.nodes.length - 1) setLog((l) => [...l, `[${stamp()}] ■ Workflow finished successfully`]);
        }, t),
      );
    });
  };

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Demo scenarios" className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button key={s.id} role="tab" aria-selected={s.id === sid} onClick={() => select(s.id)}
            className={cn("flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition", s.id === sid ? "border-neon bg-neon/15 text-white" : "border-line text-soft hover:border-line-strong hover:text-white")}>
            <ServiceIcon name={s.icon} className="h-4 w-4 text-neon" />{s.title}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Workflow · simulated</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{sc.title}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={run} disabled={running} className="shine inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-neon to-cyan px-5 text-sm font-medium text-onbrand disabled:opacity-60">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} {done ? "Run again" : running ? "Running…" : "Run workflow"}
              </button>
              {step >= 0 && <button onClick={reset} aria-label="Reset" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-soft hover:text-white"><RotateCcw className="h-4 w-4" /></button>}
            </div>
          </div>
          <ol className="relative space-y-3">
            {sc.nodes.map((n, i) => {
              const Icon = kindIcon[n.kind];
              const state = step > i ? "done" : step === i ? "active" : "idle";
              return (
                <li key={n.name} className="relative">
                  {i < sc.nodes.length - 1 && (
                    <span aria-hidden className="absolute left-[23px] top-12 h-[calc(100%-24px)] w-0.5 overflow-hidden bg-line">
                      <motion.span className="block w-full bg-gradient-to-b from-neon to-cyan" initial={false} animate={{ height: step > i ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                    </span>
                  )}
                  <div className={cn("flex items-center gap-4 rounded-2xl border p-3 transition-all duration-300",
                    state === "done" ? "border-neon/40 bg-neon/[.06]" : state === "active" ? "border-cyan/60 bg-cyan/[.08] shadow-[0_0_30px_-10px_var(--color-cyan)]" : "border-line bg-ink/40")}>
                    <span className={cn("relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      state === "idle" ? "bg-white/[.04] text-muted" : "bg-gradient-to-br from-neon to-cyan text-onbrand")}>
                      {state === "active" ? <Loader2 className="h-5 w-5 animate-spin" /> : state === "done" ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{n.name}</p>
                        <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted">{kindLabel[n.kind]}</span>
                      </div>
                      <p className="text-xs text-muted">{n.detail}</p>
                    </div>
                    <AnimatePresence>
                      {state === "done" && (
                        <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="hidden max-w-[45%] truncate rounded-lg bg-ink/70 px-2.5 py-1 font-mono text-[11px] text-neon sm:block">{n.output}</motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wider text-muted">Input · {sc.trigger}</p>
            <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-ink/80 p-4 font-mono text-xs leading-relaxed text-soft">{JSON.stringify(sc.input, null, 2)}</pre>
          </div>
          <div className="card p-5" aria-live="polite">
            <p className="text-xs uppercase tracking-wider text-muted">Execution log</p>
            <div className="mt-3 h-40 overflow-auto rounded-xl bg-ink/80 p-4 font-mono text-[11px] leading-relaxed">
              {log.length === 0 ? <p className="text-muted">Press “Run workflow” to start the simulation.</p> : log.map((l, i) => <p key={i} className={l.includes("■") ? "text-neon" : "text-soft"}>{l}</p>)}
            </div>
          </div>
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-neon/40 bg-gradient-to-br from-neon/10 to-cyan/5 p-5">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon"><Sparkles className="h-4 w-4" /> Sample AI output</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/90">{sc.aiResponse}</p>
                <pre className="mt-4 overflow-auto rounded-xl bg-ink/80 p-3 font-mono text-[11px] text-soft">{JSON.stringify(sc.result, null, 2)}</pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">Before vs after automation</h2>
          <div role="tablist" aria-label="Compare process" className="flex rounded-full border border-line p-1">
            {(["before", "after"] as const).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}
                className={cn("rounded-full px-4 py-1.5 text-sm capitalize transition", view === v ? (v === "after" ? "bg-gradient-to-r from-neon to-cyan text-onbrand" : "bg-warning/20 text-warning") : "text-soft")}>
                {v === "before" ? "Manual process" : "Automated"}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.ol key={view + sc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sc[view].map((s, i) => (
              <li key={s.step} className={cn("rounded-xl border p-4", view === "before" ? "border-warning/25 bg-warning/[.05]" : "border-neon/30 bg-neon/[.05]")}>
                <p className="font-mono text-[11px] text-muted">STEP {i + 1}</p>
                <p className="mt-1 text-sm text-white">{s.step}</p>
                <p className={cn("mt-2 inline-flex items-center gap-1 text-xs", view === "before" ? "text-warning" : "text-neon")}><Clock className="h-3.5 w-3.5" />{s.time}</p>
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>
        <p className="mt-4 text-xs text-muted">Times are illustrative estimates for a typical small business, not measured client results.</p>
      </div>
    </div>
  );
}
