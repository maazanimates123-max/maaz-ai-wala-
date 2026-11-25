import Link from "next/link";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div aria-hidden className="absolute inset-0 grid-bg" />
      <div className="relative">
        <LogoMark className="mx-auto block! h-14 w-14" />
        <p className="mt-8 font-mono text-sm text-neon">404</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-neon px-6 py-3 text-sm font-medium text-onbrand">Go home</Link>
          <Link href="/contact" className="rounded-full border border-white/10 px-6 py-3 text-sm text-white">Contact us</Link>
        </div>
      </div>
    </main>
  );
}
