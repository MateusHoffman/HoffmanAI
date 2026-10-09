import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { MarkdownBody } from "../chat/MarkdownBody";
import { exportCurriculoPdf } from "./exportCurriculoPdf";

export function CurriculoPage() {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/curriculo.md")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (alive) {
          setContent(text);
          setError(null);
        }
      })
      .catch(() => {
        if (alive) setError("Não foi possível carregar o currículo.");
      });
    return () => {
      alive = false;
    };
  }, []);

  async function downloadPdf() {
    if (!content || exporting) return;
    setExporting(true);
    setError(null);
    try {
      await exportCurriculoPdf(content);
    } catch {
      setError("Falha ao gerar o PDF. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium">Currículo</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Leia o perfil completo ou baixe o arquivo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/curriculo.md"
              download="curriculo-mateus-hoffman.md"
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 text-sm hover:bg-white/10"
            >
              <FileText size={16} strokeWidth={1.75} />
              Baixar .md
            </a>
            <button
              type="button"
              onClick={() => void downloadPdf()}
              disabled={!content || exporting}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-white px-3 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-40"
            >
              <Download size={16} strokeWidth={1.75} />
              {exporting ? "Gerando PDF…" : "Baixar PDF"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded-2xl border border-[var(--err)]/40 bg-[var(--err)]/10 px-4 py-3 text-sm text-[var(--err)]">
            {error}
          </p>
        ) : null}

        {!content && !error ? <p className="pulse-dot text-sm text-[var(--text-muted)]">Carregando currículo…</p> : null}

        {content ? (
          <article className="rounded-2xl border border-white/10 bg-[#2a2a2a] px-5 py-6 sm:px-8 sm:py-8">
            <div className="markdown-doc">
              <MarkdownBody content={content} />
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
