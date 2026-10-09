import { ArrowUp, Briefcase, Building, Code, FileText, RotateCcw, Sparkles, Square } from "lucide-react";
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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
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

      <div className="shrink-0 bg-[var(--bg)] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-4">
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl">
          <div className="flex items-end gap-2 rounded-[28px] bg-[var(--surface)] py-2 pr-2 pl-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] focus-within:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
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
    <div className="flex min-h-full flex-col px-4 py-6">
      <div className="m-auto w-full max-w-2xl">
        <h1 className="text-center text-[28px] font-medium tracking-tight">Como posso ajudar?</h1>
        <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
          Pergunte sobre a trajetória do Mateus Hoffman ou comece por um atalho.
        </p>
        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Starter href={WHATSAPP_URL} external icon={<WhatsAppIcon size={18} />} title="Chamar no WhatsApp" subtitle="Mensagem direta para o Mateus" />
          <Starter to="/curriculo" icon={<FileText size={18} strokeWidth={1.75} />} title="Ver currículo completo" subtitle="Experiência, stack e projetos" />
          <Starter icon={<Briefcase size={18} strokeWidth={1.75} />} title="Enviar descrição da vaga" subtitle="Ver se o perfil dá fit" disabled={blocked} onClick={onFit} />
          <Starter icon={<Sparkles size={18} strokeWidth={1.75} />} title="Experiência com IA" subtitle="RAG, agentes e function calling" disabled={blocked} onClick={() => onPrompt("Qual a experiência dele com RAG e agentes?")} />
          <Starter icon={<Building size={18} strokeWidth={1.75} />} title="O que ele fez na SuaMEi" subtitle="Liderança técnica e produtos" disabled={blocked} onClick={() => onPrompt("O que ele fez na SuaMEi?")} />
          <Starter icon={<Code size={18} strokeWidth={1.75} />} title="Quais stacks ele domina" subtitle="TypeScript, cloud e backend" disabled={blocked} onClick={() => onPrompt("Quais stacks ele domina?")} />
        </div>
      </div>
    </div>
  );
}

function Starter({
  icon,
  title,
  subtitle,
  onClick,
  href,
  to,
  external,
  disabled,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  href?: string;
  to?: string;
  external?: boolean;
  disabled?: boolean;
}) {
  const className =
    "flex items-start gap-3 rounded-2xl border border-white/10 px-4 py-3.5 text-left transition-colors hover:bg-white/5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";
  const body = (
    <>
      <span className="mt-0.5 text-[var(--text-muted)]">{icon}</span>
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-0.5 block text-xs leading-5 text-[var(--text-muted)]">{subtitle}</span>
      </span>
    </>
  );
  if (to) return <Link to={to} className={className}>{body}</Link>;
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
