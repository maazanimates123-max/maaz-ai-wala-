import { LogoMark } from "@/components/layout/logo";

/** Branded loading screen shown while a page streams in. */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
      <span className="relative">
        <span aria-hidden className="absolute -inset-4 animate-ping rounded-3xl bg-neon/20 [animation-duration:1.6s]" />
        <LogoMark className="logo-glow h-16 w-16" />
      </span>
      <p className="font-mono text-xs uppercase tracking-[.3em] text-muted">Loading</p>
    </div>
  );
}
