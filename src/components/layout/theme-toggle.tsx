"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "maw-theme";

/** Inline script (in <head>) that applies the saved theme before first paint — avoids a flash. */
export const themeInitScript = `try{var t=localStorage.getItem("${KEY}");if(t==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const id = requestAnimationFrame(() => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"));
    return () => cancelAnimationFrame(id);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-soft transition hover:border-neon/50 hover:text-neon ${className}`}
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
