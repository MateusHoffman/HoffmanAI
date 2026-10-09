import { useState } from "react";

export function UserMessageBubble({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="max-w-[80%] cursor-pointer rounded-3xl bg-[var(--surface)] px-4 py-2.5 text-left"
      title={open ? "Recolher" : "Expandir"}
    >
      <p className={`whitespace-pre-wrap text-base leading-7 ${open ? "" : "line-clamp-4"}`}>
        {content}
      </p>
    </button>
  );
}
