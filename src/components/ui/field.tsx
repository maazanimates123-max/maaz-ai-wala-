import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-[15px] text-white placeholder:text-muted/70 transition focus:border-neon/60 focus:outline-none focus:ring-2 focus:ring-neon/20 disabled:opacity-60 aria-[invalid=true]:border-danger/60";

export function Field({ label, htmlFor, error, hint, required, children, className }: {
  label: string; htmlFor: string; error?: string; hint?: ReactNode; required?: boolean; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-white/90">
        {label} {required && <span className="text-neon" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(inputClass, "min-h-28 resize-y leading-relaxed", className)} {...props} />;
}
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238b8b96%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Alert({ tone = "info", title, children }: { tone?: "info" | "success" | "error" | "warn"; title?: string; children?: ReactNode }) {
  const styles = {
    info: "border-info/30 bg-info/[.07] text-info",
    success: "border-neon/30 bg-neon/[.07] text-neon",
    error: "border-danger/30 bg-danger/[.07] text-danger",
    warn: "border-warning/30 bg-warning/[.07] text-warning",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-xl border px-4 py-3 text-sm", styles)}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={cn("text-white/80", title && "mt-1")}>{children}</div>}
    </div>
  );
}
