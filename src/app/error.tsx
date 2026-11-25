"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    fetch("/api/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: String(error.message).slice(0, 1000), digest: error.digest, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [error]);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-danger">Error</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">An unexpected error occurred. Please try again. If it keeps happening, contact us.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="rounded-full bg-neon px-6 py-3 text-sm font-medium text-onbrand">Try again</button>
        <Link href="/" className="rounded-full border border-white/10 px-6 py-3 text-sm text-white">Go home</Link>
      </div>
    </main>
  );
}
