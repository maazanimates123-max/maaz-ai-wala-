import Link from "next/link";
import Image from "next/image";

/** The official Maaz AI Wala mark (M + shield + orbit), from /public/logo-mark-*.png. */
export function LogoMark({ className = "h-8 w-8", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <Image src="/logo-mark-128.png" alt="" fill sizes="64px" priority={priority} className="object-contain" />
    </span>
  );
}

/** Brand wordmark. The name is editable in Admin → Website content; the word "AI" gets the shimmer highlight. */
export function BrandName({ name = "Maaz AI Wala" }: { name?: string }) {
  const parts = name.split(/(\bAI\b)/);
  return <>{parts.map((p, i) => (p === "AI" ? <span key={i} className="text-shimmer">AI</span> : <span key={i}>{p}</span>))}</>;
}

export function Logo({ name = "Maaz AI Wala" }: { name?: string }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${name} — home`}>
      <LogoMark priority className="logo-glow h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
      <span className="text-[15px] font-bold uppercase tracking-[.08em] text-white"><BrandName name={name} /></span>
    </Link>
  );
}
