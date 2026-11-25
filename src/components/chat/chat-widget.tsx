"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, Minus, RotateCcw, Send, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "assistant" | "error"; content: string; retryText?: string };

const STORAGE_KEY = "maw-chat-v1";
const MAX_LEN = 2000;

function newSessionId() {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `web_${rand.replace(/[^A-Za-z0-9_-]/g, "")}`.slice(0, 64);
}

function load(): { sessionId: string; messages: Msg[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.sessionId === "string" && Array.isArray(parsed.messages)) return parsed;
  } catch {
    /* storage unavailable */
  }
  return null;
}
function save(sessionId: string, messages: Msg[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, messages: messages.slice(-40) }));
  } catch {
    /* ignore */
  }
}

/** Renders plain text safely, turning URLs and line breaks into readable output (no HTML injection). */
function MessageText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">
            {p}
          </a>
        ) : (
          <span key={i}>{p.replace(/\*\*(.+?)\*\*/g, "$1")}</span>
        ),
      )}
    </p>
  );
}

export function ChatWidget({ name, welcome, position = "right", humanLink = "/contact" }: { name: string; welcome: string; position?: "left" | "right"; humanLink?: string }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const stored = load();
      if (stored) {
        setSessionId(stored.sessionId);
        setMessages(stored.messages);
      } else {
        setSessionId(newSessionId());
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (sessionId) save(sessionId, messages);
  }, [sessionId, messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, sending, open, reduce]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || sending || !sessionId) return;
      const userMsg: Msg = { id: `u${Date.now()}`, role: "user", content: message };
      // Last turns sent as context so the n8n agent can keep the conversation coherent.
      const history = messages
        .filter((m) => m.role !== "error")
        .slice(-10)
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 2000) }));
      setMessages((m) => [...m.filter((x) => x.role !== "error"), userMsg]);
      setInput("");
      setSending(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, sessionId, page: pathname || "/", history }),
        });
        const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
        if (res.ok && data.reply) {
          setMessages((m) => [...m, { id: `a${Date.now()}`, role: "assistant", content: data.reply! }]);
        } else {
          setMessages((m) => [
            ...m,
            { id: `e${Date.now()}`, role: "error", content: data.error ?? "The assistant is unavailable right now.", retryText: message },
          ]);
        }
      } catch {
        setMessages((m) => [
          ...m,
          { id: `e${Date.now()}`, role: "error", content: "Network error — please check your connection.", retryText: message },
        ]);
      } finally {
        setSending(false);
      }
    },
    [pathname, sending, sessionId, messages],
  );

  const reset = () => {
    setMessages([]);
    setSessionId(newSessionId());
  };

  const side = position === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed z-[60] flex flex-col overflow-hidden border border-neon/20 bg-surface/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,.9),0_0_0_1px_rgba(167,139,250,.08)]",
              "inset-x-0 bottom-0 top-[max(env(safe-area-inset-top),0px)] rounded-none sm:inset-auto sm:bottom-24 sm:h-[min(620px,calc(100vh-8rem))] sm:w-[400px] sm:rounded-3xl",
              position === "left" ? "sm:left-6" : "sm:right-6",
            )}
          >
            <header className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-neon/[.08] to-transparent px-5 py-4">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-neon/15 ring-1 ring-neon/30">
                <Bot className="h-5 w-5 text-neon" aria-hidden />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-neon" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="truncate text-sm font-semibold text-white">{name}</h2>
                <p className="text-xs text-muted">AI assistant · may make mistakes</p>
              </div>
              <button type="button" onClick={reset} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-white" aria-label="Start a new conversation">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button type="button" onClick={close} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-white" aria-label="Minimise chat">
                <Minus className="h-4 w-4 hidden sm:block" />
                <X className="h-5 w-5 sm:hidden" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite" aria-relevant="additions">
              <Bubble role="assistant">{welcome}</Bubble>
              {messages.map((m) =>
                m.role === "error" ? (
                  <div key={m.id} role="alert" className="mr-8 rounded-2xl rounded-tl-md border border-danger/30 bg-danger/[.08] px-4 py-3 text-sm text-white/90">
                    <p>{m.content}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      {m.retryText && (
                        <button type="button" className="font-medium text-neon hover:underline" onClick={() => send(m.retryText!)}>
                          Try again
                        </button>
                      )}
                      <Link href="/contact" className="font-medium text-neon hover:underline" onClick={close}>
                        Contact us instead
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Bubble key={m.id} role={m.role}>
                    <MessageText text={m.content} />
                  </Bubble>
                ),
              )}
              {sending && (
                <div className="mr-auto flex w-16 items-center justify-center gap-1 rounded-2xl rounded-tl-md bg-elevated px-4 py-3.5" aria-label={`${name} is typing`}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {["What services do you offer?", "Which package is right for me?", "How do I start a project?"].map((q) => (
                    <button key={q} type="button" onClick={() => send(q)} className="rounded-full border border-neon/25 bg-neon/[.05] px-3 py-1.5 text-xs text-neon transition hover:bg-neon/15">
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto border-t border-line px-3 pt-3 text-xs">
              <Link href="/start-project" onClick={close} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-soft hover:border-neon/50 hover:text-white">🚀 Start a project</Link>
              <Link href="/pricing" onClick={close} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-soft hover:border-neon/50 hover:text-white">💳 See pricing</Link>
              <a href={humanLink} onClick={close} {...(humanLink.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-soft hover:border-neon/50 hover:text-white">✉️ Email a human</a>
            </div>

            <form
              className="border-t border-line p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-ink/70 p-1.5 focus-within:border-neon/50">
                <label htmlFor="chat-input" className="sr-only">Type your message</label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_LEN}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about our services…"
                  className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-white placeholder:text-muted focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon text-onbrand transition hover:bg-neon-strong disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 px-1 text-[11px] text-muted">
                Please don&apos;t share passwords or payment details. See our <Link href="/privacy" className="underline">privacy policy</Link>.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? `Close ${name}` : `Open ${name}`}
        aria-expanded={open}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        className={cn(
          "fixed bottom-4 z-[61] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-neon to-cyan text-onbrand shadow-[0_0_0_5px_rgba(167,139,250,.12),0_12px_40px_-6px_rgba(167,139,250,.7)] sm:bottom-6 sm:h-14 sm:w-14",
          side,
          open && "hidden sm:flex",
        )}
      >
        {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
        {!open && <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-neon/40 [animation-duration:2.6s]" />}
      </motion.button>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-[86%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed",
        role === "user" ? "ml-auto rounded-tr-md bg-neon text-onbrand" : "mr-auto rounded-tl-md bg-elevated text-white/90 ring-1 ring-white/5",
      )}
    >
      {children}
    </div>
  );
}
