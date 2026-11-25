import { cn, humanize } from "@/lib/utils";

const tones: Record<string, string> = {
  neon: "bg-neon/10 text-neon border-neon/25",
  grey: "bg-white/[.05] text-soft border-white/10",
  warn: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-danger/10 text-danger border-danger/25",
  info: "bg-info/10 text-info border-info/25",
};

const statusTone: Record<string, keyof typeof tones> = {
  new: "info", open: "info", unpaid: "grey", draft: "grey", pending: "warn",
  under_review: "warn", quotation_sent: "info", awaiting_payment: "warn", in_progress: "neon", testing: "info",
  completed: "neon", paid: "neon", accepted: "neon", resolved: "neon", qualified: "neon", converted: "neon",
  sent: "info", forwarded: "neon", replied: "neon", read: "grey", contacted: "info",
  cancelled: "danger", failed: "danger", declined: "danger", refunded: "grey", unqualified: "grey", archived: "grey",
  closed: "grey", expired: "grey", not_configured: "warn",
};

export function Badge({ children, tone = "grey", className }: { children: React.ReactNode; tone?: keyof typeof tones; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone[status] ?? "grey"}>{humanize(status)}</Badge>;
}
