import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { WHATSAPP_URL } from "../../lib/links";

const EMAIL = "mateushoffmandev@gmail.com";
const CTA = "Clique aqui para falar com o Mateus";

function enrichCta(raw: string): string {
  let text = raw;
  if (text.includes(CTA) && !text.includes("](https://wa.me/")) {
    text = text.replaceAll(CTA, `[${CTA}](${WHATSAPP_URL})`);
  }
  if (text.includes(EMAIL) && !text.includes(`](mailto:${EMAIL})`)) {
    text = text.replaceAll(EMAIL, `[${EMAIL}](mailto:${EMAIL})`);
  }
  return text;
}

const components: Components = {
  table: ({ children }) => (
    <div className="md-table-wrap">
      <table>{children}</table>
    </div>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="markdown-body markdown-assistant text-base leading-7">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {enrichCta(content)}
      </ReactMarkdown>
    </div>
  );
}
