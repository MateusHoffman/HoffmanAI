import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

function inlineText(raw: string): Content {
  const parts: Content[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(raw)) !== null) {
    if (match.index > last) {
      parts.push(raw.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push({ text: token.slice(2, -2), bold: true });
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        parts.push({ text: link[1], color: "#0f6b5c", link: link[2] });
      }
    }
    last = match.index + token.length;
  }
  if (last < raw.length) parts.push(raw.slice(last));
  return parts.length === 1 ? parts[0]! : { text: parts };
}

function markdownToContent(md: string): Content[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const content: Content[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    if (text) content.push({ text: inlineText(text), margin: [0, 0, 0, 8] });
    paragraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }
    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      content.push({
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#cfc6b6" }],
        margin: [0, 4, 0, 12],
      });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph();
      content.push({
        text: trimmed.slice(2).replace(/^[^\wÀ-ú]+/u, "").trim() || trimmed.slice(2),
        style: "h1",
      });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      content.push({
        text: trimmed.slice(3),
        style: "h2",
      });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      content.push({
        text: trimmed.slice(4),
        style: "h3",
      });
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      content.push({
        text: inlineText(trimmed.replace(/^[-*]\s+/, "")),
        margin: [12, 0, 0, 4],
        style: "bullet",
      });
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph();
  return content;
}

export async function exportCurriculoPdf(markdown: string): Promise<void> {
  const pdfMakeMod = await import("pdfmake/build/pdfmake");
  const pdfFontsMod = await import("pdfmake/build/vfs_fonts");
  const pdfMake = pdfMakeMod.default as typeof pdfMakeMod.default & {
    addVirtualFileSystem: (vfs: unknown) => void;
  };
  pdfMake.addVirtualFileSystem(pdfFontsMod.default);

  const doc: TDocumentDefinitions = {
    info: {
      title: "Currículo — Mateus Hoffman",
      author: "Mateus Hoffman",
    },
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: "Roboto",
      fontSize: 10,
      lineHeight: 1.35,
      color: "#14201b",
    },
    styles: {
      h1: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
      h2: { fontSize: 13, bold: true, margin: [0, 14, 0, 8] },
      h3: { fontSize: 11, bold: true, margin: [0, 10, 0, 6] },
      bullet: { fontSize: 10 },
    },
    content: markdownToContent(markdown),
  };

  await new Promise<void>((resolve, reject) => {
    try {
      pdfMake.createPdf(doc).download("curriculo-mateus-hoffman.pdf", () => resolve());
    } catch (err) {
      reject(err);
    }
  });
}
