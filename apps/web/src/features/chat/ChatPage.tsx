import { ArrowUp, Briefcase, FileText, RotateCcw, Sparkles, Square } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { WhatsAppIcon } from "../../components/BrandIcons";
import { sendChat } from "../../lib/chatApi";
import { WHATSAPP_URL } from "../../lib/links";
import { getMessages, saveMessages, SESSION_CLEARED_EVENT, type ChatMessage } from "../../lib/session";
import { MarkdownBody } from "./MarkdownBody";
import { UserMessageBubble } from "./UserMessageBubble";

const FIT_DRAFT = "Avalie o fit do Mateus Hoffman para esta vaga. Descrição:\n\n";

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getMessages());
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    function onClear() {
      abortRef.current?.abort();
      abortRef.current = null;
      setMessages([]);
      setInput("");
      setBusy(false);
      textareaRef.current?.focus();
    }
    window.addEventListener(SESSION_CLEARED_EVENT, onClear);
    return () => window.removeEventListener(SESSION_CLEARED_EVENT, onClear);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  async function send(text: string, retry = false) {
    const message = text.trimEnd();
    if (!message.trim() || busy) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);

    let next: ChatMessage[];
    if (retry) {
      next = [...messages];
      const last = next[next.length - 1];
      if (last?.role === "assistant") next[next.length - 1] = { role: "assistant", content: "" };
    } else {
      setInput("");
      next = [...messages, { role: "user", content: message }, { role: "assistant", content: "" }];
    }
    setMessages(next);

    const history = next
      .slice(0, -1)
      .filter((m) => m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await sendChat(
        history,
        (delta) => {
          if (abortRef.current !== controller) return;
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant" && !last.failed) {
              copy[copy.length - 1] = { role: "assistant", content: last.content + delta };
            }
            return copy;
          });
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        controller.signal,
      );
    } catch (err) {
      if (abortRef.current !== controller) return;
      if (isAbort(err)) {
        setMessages((m) => {
          const last = m[m.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return retry
              ? [...m.slice(0, -1), { role: "assistant", content: "Geração interrompida.", failed: true }]
              : m.slice(0, -1);
          }
          return m;
        });
        return;
      }
      const msg = err instanceof Error ? err.message : "Não consegui responder. Tente de novo.";
      setMessages((m) => {
        const copy = [...m];
        if (copy[copy.length - 1]?.role === "assistant") {
          copy[copy.length - 1] = { role: "assistant", content: msg, failed: true };
        }
        return copy;
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setBusy(false);
      }
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) {
      abortRef.current?.abort();
      return;
    }
    void send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <div className={`relative flex min-h-0 flex-1 flex-col ${isEmpty ? "overflow-hidden" : ""}`}>
      {isEmpty ? <EmptyAtmosphere /> : null}

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyState
            blocked={busy}
            onPrompt={(p) => void send(p)}
            onFit={() => {
              setInput(FIT_DRAFT);
              requestAnimationFrame(() => {
                const el = textareaRef.current;
                if (!el) return;
                el.focus();
                el.setSelectionRange(el.value.length, el.value.length);
              });
            }}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={m.role === "user" ? "flex justify-end" : ""}>
                {m.role === "user" ? (
                  <UserMessageBubble content={m.content} />
                ) : m.failed ? (
                  <div className="flex items-start gap-2">
                    <p className="min-w-0 flex-1 text-base leading-7 text-[var(--err)]">{m.content}</p>
                    <button
                      type="button"
                      title="Tentar novamente"
                      disabled={busy}
                      onClick={() => void send(messages[i - 1]?.content ?? "", true)}
                      className="mt-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)] disabled:opacity-40"
                    >
                      <RotateCcw size={16} strokeWidth={2} />
                    </button>
                  </div>
                ) : m.content ? (
                  <MarkdownBody content={m.content} />
                ) : busy && i === messages.length - 1 ? (
                  <TypingDots />
                ) : null}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div
        className={`relative z-10 shrink-0 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-4 ${
          isEmpty ? "bg-transparent" : "bg-[var(--bg)]"
        }`}
      >
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl">
          <div
            className={`flex items-end gap-2 rounded-[28px] bg-[var(--surface)] py-2 pr-2 pl-2 transition-shadow ${
              isEmpty
                ? "shadow-[inset_0_0_0_1px_rgba(43,140,255,0.35),0_0_0_1px_rgba(43,140,255,0.12),0_12px_40px_rgba(0,0,0,0.45)] focus-within:shadow-[inset_0_0_0_1px_rgba(43,140,255,0.55),0_0_0_1px_rgba(43,140,255,0.2),0_16px_48px_rgba(0,0,0,0.5)]"
                : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] focus-within:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Pergunte alguma coisa"
              disabled={busy}
              enterKeyHint="send"
              className="max-h-[200px] min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-base leading-6 outline-none placeholder:text-[var(--text-faint)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!busy && !input.trim()}
              aria-label={busy ? "Parar geração" : "Enviar"}
              className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--blue)] text-white hover:bg-[var(--blue-hover)] disabled:opacity-40"
            >
              {busy ? <Square size={12} fill="currentColor" strokeWidth={0} /> : <ArrowUp size={18} strokeWidth={2.5} />}
            </button>
          </div>
          <p className="px-4 pt-2 text-center text-xs text-[var(--text-faint)]">
            HoffmanAI pode errar. Confira dados importantes no currículo.
          </p>
        </form>
      </div>
    </div>
  );
}

function EmptyAtmosphere() {
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;
    if (!forward || !reverse) return;

    let alive = true;
    let busy = false;
    let forwardDir = true;

    const waitSeeked = (video: HTMLVideoElement, time: number) =>
      new Promise<void>((resolve) => {
        if (Math.abs(video.currentTime - time) < 0.02 && video.readyState >= 2) {
          resolve();
          return;
        }
        const done = () => {
          video.removeEventListener("seeked", done);
          resolve();
        };
        video.addEventListener("seeked", done);
        video.currentTime = time;
      });

    const waitPaintedFrame = (video: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        const withRvcf = video as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        };
        if (typeof withRvcf.requestVideoFrameCallback === "function") {
          withRvcf.requestVideoFrameCallback(() => resolve());
          return;
        }
        const done = () => {
          video.removeEventListener("timeupdate", done);
          resolve();
        };
        video.addEventListener("timeupdate", done);
      });

    const swapTo = async (next: HTMLVideoElement, prev: HTMLVideoElement) => {
      if (!alive || busy) return;
      busy = true;
      try {
        next.pause();
        await waitSeeked(next, 0);
        if (!alive) return;
        await next.play();
        await waitPaintedFrame(next);
        if (!alive) return;
        // Só esconde o anterior depois do próximo já ter frame na tela.
        next.style.zIndex = "2";
        next.style.opacity = "1";
        prev.style.opacity = "0";
        prev.style.zIndex = "1";
        prev.pause();
      } finally {
        busy = false;
      }
    };

    const warmInactive = (inactive: HTMLVideoElement) => {
      if (inactive.readyState >= 2 && inactive.currentTime < 0.05) return;
      try {
        inactive.currentTime = 0;
      } catch {
        /* ignore */
      }
    };

    const onForwardTime = () => {
      if (!forwardDir || !Number.isFinite(forward.duration)) return;
      if (forward.duration - forward.currentTime < 0.6) warmInactive(reverse);
    };

    const onReverseTime = () => {
      if (forwardDir || !Number.isFinite(reverse.duration)) return;
      if (reverse.duration - reverse.currentTime < 0.6) warmInactive(forward);
    };

    const onForwardEnded = () => {
      if (!alive || !forwardDir) return;
      forwardDir = false;
      void swapTo(reverse, forward);
    };

    const onReverseEnded = () => {
      if (!alive || forwardDir) return;
      forwardDir = true;
      void swapTo(forward, reverse);
    };

    forward.loop = false;
    reverse.loop = false;
    forward.style.zIndex = "2";
    forward.style.opacity = "1";
    reverse.style.zIndex = "1";
    reverse.style.opacity = "0";
    warmInactive(reverse);

    forward.addEventListener("ended", onForwardEnded);
    reverse.addEventListener("ended", onReverseEnded);
    forward.addEventListener("timeupdate", onForwardTime);
    reverse.addEventListener("timeupdate", onReverseTime);
    void forward.play().catch(() => undefined);

    return () => {
      alive = false;
      forward.removeEventListener("ended", onForwardEnded);
      reverse.removeEventListener("ended", onReverseEnded);
      forward.removeEventListener("timeupdate", onForwardTime);
      reverse.removeEventListener("timeupdate", onReverseTime);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <video
        ref={forwardRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/empty-atmosphere.jpg"
      >
        <source src="/empty-atmosphere.mp4" type="video/mp4" />
      </video>
      <video
        ref={reverseRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source src="/empty-atmosphere-rev.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,rgba(10,12,18,0.35)_0%,rgba(10,12,18,0.72)_52%,rgba(10,12,18,0.9)_100%)]" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/20 via-transparent to-[var(--bg)]" />
      <div
        className="absolute inset-0 z-[3] opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function EmptyState({
  blocked,
  onPrompt,
  onFit,
}: {
  blocked: boolean;
  onPrompt: (prompt: string) => void;
  onFit: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col px-4 pt-16 pb-8 sm:pt-20 sm:pb-10">
      <div className="m-auto flex w-full max-w-2xl flex-col items-center text-center">
        <p className="empty-rise">
          <span className="font-display brand-stretch text-[clamp(2.75rem,8vw,4.25rem)] leading-none font-extrabold tracking-[-0.04em] text-white">
            HoffmanAI
          </span>
        </p>
        <h1 className="empty-rise empty-rise-delay-1 mt-4 max-w-xl text-[clamp(1.15rem,3.2vw,1.55rem)] leading-snug font-medium tracking-tight text-white/95">
          Pergunte qualquer coisa sobre o Mateus.
        </h1>
        <p className="empty-rise empty-rise-delay-2 mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)] sm:text-[15px]">
          Trajetória, stack e fit de vaga — em chat.
        </p>
        <div className="mt-8 flex w-full max-w-xl flex-wrap items-center justify-center gap-2">
          <Chip icon={<Briefcase size={15} strokeWidth={1.75} />} label="Colar vaga" disabled={blocked} onClick={onFit} />
          <Chip
            icon={<Sparkles size={15} strokeWidth={1.75} />}
            label="Experiência com IA"
            disabled={blocked}
            onClick={() => onPrompt("Qual a experiência dele com RAG e agentes?")}
          />
          <Chip icon={<FileText size={15} strokeWidth={1.75} />} label="Ver currículo" to="/curriculo" />
          <Chip icon={<WhatsAppIcon size={15} />} label="WhatsApp" href={WHATSAPP_URL} external />
        </div>
      </div>
    </div>
  );
}

function Chip({
  icon,
  label,
  onClick,
  href,
  to,
  external,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  to?: string;
  external?: boolean;
  disabled?: boolean;
}) {
  const className =
    "empty-chip inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-2 text-sm text-[var(--text)] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";
  const body = (
    <>
      <span className="text-[var(--text-muted)]">{icon}</span>
      <span>{label}</span>
    </>
  );
  if (to)
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  if (href)
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={className}>
        {body}
      </a>
    );
  return (
    <button type="button" className={`${className} cursor-pointer`} onClick={onClick} disabled={disabled}>
      {body}
    </button>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex h-7 items-center gap-1" aria-label="Gerando resposta">
      <span className="pulse-dot size-1.5 rounded-full bg-white/80" />
      <span className="pulse-dot size-1.5 rounded-full bg-white/80 [animation-delay:150ms]" />
      <span className="pulse-dot size-1.5 rounded-full bg-white/80 [animation-delay:300ms]" />
    </span>
  );
}

function isAbort(err: unknown) {
  return typeof err === "object" && err !== null && "name" in err && (err as { name: string }).name === "AbortError";
}
