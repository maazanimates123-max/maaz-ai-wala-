"use client";
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function youtubeId(v: string) {
  const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/) ?? v.match(/^([A-Za-z0-9_-]{11})$/);
  return m?.[1] ?? null;
}

/** Loads the YouTube player only after a click (privacy-enhanced domain, no tracking until play). */
export function LiteYouTube({ idOrUrl, title }: { idOrUrl: string; title: string }) {
  const id = youtubeId(idOrUrl);
  const [play, setPlay] = useState(false);
  if (!id) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink">
      {play ? (
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Play video: ${title}`}>
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover opacity-80 transition group-hover:opacity-100" unoptimized />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-xl transition group-hover:scale-110"><Play className="h-7 w-7 fill-white" /></span>
        </button>
      )}
    </div>
  );
}
