"use client";
import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import { FacebookIcon, LinkedInIcon } from "@/components/ui/brand-icons";

/** Share links use each platform's public share URL — no tracking scripts loaded. */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const enc = encodeURIComponent;
  const links = [
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: <LinkedInIcon className="h-4 w-4" /> },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, icon: <FacebookIcon className="h-4 w-4" /> },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, icon: <span className="text-sm font-bold">𝕏</span> },
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, icon: <span className="text-xs font-bold">WA</span> },
  ];
  const btn = "flex h-10 w-10 items-center justify-center rounded-full border border-line text-soft transition hover:border-neon/50 hover:text-neon";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 flex items-center gap-1.5 text-sm text-muted"><Share2 className="h-4 w-4" /> Share</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className={btn}>{l.icon}</a>
      ))}
      <button
        type="button"
        aria-label="Copy link"
        className={btn}
        onClick={async () => {
          try {
            if (navigator.share) await navigator.share({ title, url });
            else {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          } catch {
            /* user cancelled */
          }
        }}
      >
        {copied ? <Check className="h-4 w-4 text-neon" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
