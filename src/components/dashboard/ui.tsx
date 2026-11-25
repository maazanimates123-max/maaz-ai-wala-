import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, href, accent }: { label: string; value: React.ReactNode; hint?: string; href?: string; accent?: boolean }) {
  const inner = (
    <div className={cn("card h-full p-5 transition", href && "hover:border-line-strong", accent && "border-neon/30")}>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className={cn("mt-2 text-3xl font-semibold tabular-nums", accent ? "text-neon" : "text-white")}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function Panel({ title, actions, children, className }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card p-5 sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-semibold text-white">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Empty({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="font-medium text-white">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-white/[.03] text-xs uppercase tracking-wider text-muted">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function DL({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-xs uppercase tracking-wider text-muted">{k}</dt>
          <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-white/90">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
      <div className="h-full rounded-full bg-neon shadow-[0_0_12px_#a78bfa]" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function SetupNotice({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 rounded-xl border border-warning/30 bg-warning/[.07] px-4 py-3 text-sm text-warning">{children}</div>;
}
