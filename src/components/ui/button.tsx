import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary:
    "shine bg-gradient-to-r from-neon to-cyan text-onbrand hover:brightness-110 shadow-[0_0_0_1px_rgba(167,139,250,.4),0_8px_30px_-8px_rgba(167,139,250,.55)] hover:shadow-[0_0_0_1px_rgba(167,139,250,.6),0_10px_40px_-6px_rgba(167,139,250,.7)]",
  secondary: "bg-white/[.06] text-white border border-white/10 hover:bg-white/[.1] hover:border-white/20",
  outline: "border border-neon/40 text-neon hover:bg-neon/10",
  ghost: "text-soft hover:text-white hover:bg-white/[.05]",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
