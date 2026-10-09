const MESSAGES_KEY = "hoffmanai.messages";
export const SESSION_CLEARED_EVENT = "hoffmanai:session-cleared";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  failed?: boolean;
};

export function getMessages(): ChatMessage[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(MESSAGES_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    const messages = parsed.filter(isMessage);
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && !last.content) return messages.slice(0, -1);
    return messages;
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  if (messages.length === 0) localStorage.removeItem(MESSAGES_KEY);
  else localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function clearChatSession(): void {
  localStorage.removeItem(MESSAGES_KEY);
  window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
}

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const msg = value as ChatMessage;
  return (
    (msg.role === "user" || msg.role === "assistant") &&
    typeof msg.content === "string" &&
    (msg.failed === undefined || typeof msg.failed === "boolean")
  );
}
