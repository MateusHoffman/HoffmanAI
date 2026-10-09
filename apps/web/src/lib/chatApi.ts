export type ApiMessage = {
  role: "user" | "assistant";
  content: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function sendChat(
  messages: ApiMessage[],
  onDelta: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok) {
    let detail = res.status === 429 ? "Limite diário atingido" : `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) detail = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  if (!res.body) throw new Error("Resposta sem corpo de stream");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const raw of lines) {
      const line = raw.replace(/\r$/, "");
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
        continue;
      }
      if (!line.startsWith("data:")) {
        if (line === "") eventName = "message";
        continue;
      }

      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") {
        eventName = "message";
        continue;
      }

      let parsed: { content?: string; message?: string };
      try {
        parsed = JSON.parse(data) as { content?: string; message?: string };
      } catch {
        eventName = "message";
        continue;
      }

      if (eventName === "error") throw new Error(parsed.message || "Erro no stream");
      if (parsed.content) onDelta(parsed.content);
      eventName = "message";
    }
  }
}
