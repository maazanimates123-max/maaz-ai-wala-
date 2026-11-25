import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Horizontal (desktop) / vertical (mobile) workflow chain with animated connectors. */
export function WorkflowDiagram({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <ol className={cn("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0", className)}>
      {steps.map((step, i) => (
        <li key={step} className="flex flex-col sm:flex-row sm:items-center sm:flex-1 min-w-0">
          <div
            className={cn(
              "rounded-xl border px-3 py-2.5 text-center text-[13px] leading-snug",
              i === 0 ? "border-neon/40 bg-neon/[.08] text-neon" : "border-line bg-ink/70 text-white/90",
            )}
          >
            <span className="mr-1 font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</span> {step}
          </div>
          {i < steps.length - 1 && (
            <div aria-hidden className="flex justify-center sm:flex-1 sm:px-1 py-1 sm:py-0">
              <svg className="hidden sm:block h-3 w-full min-w-6" viewBox="0 0 40 6" preserveAspectRatio="none">
                <line x1="0" y1="3" x2="40" y2="3" stroke="#a78bfa" strokeOpacity=".6" strokeWidth="1.5" strokeDasharray="4 4" className="animate-flow" />
              </svg>
              <ArrowRight className="sm:hidden h-4 w-4 rotate-90 text-neon/70" />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
