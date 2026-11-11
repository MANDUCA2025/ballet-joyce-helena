import type { ChatReply, ChatService } from "./chat-service";
import { localChatService } from "./chat-service";
type Turn = { role: "user" | "assistant"; text: string };
export class GeminiChatService implements ChatService {
  private history: Turn[] = [];
  private consent = false;
  private generation = 0;
  constructor(private local: ChatService = localChatService) {}
  authorize() {
    this.history = [];
    this.consent = true;
    this.generation++;
  }
  revoke() {
    this.history = [];
    this.consent = false;
    this.generation++;
  }
  async reply(
    message: string,
    context: Parameters<ChatService["reply"]>[1],
  ): Promise<ChatReply> {
    if (!this.consent) return this.local.reply(message, context);
    const generation = this.generation;
    const signal = AbortSignal.any([
      context.signal,
      AbortSignal.timeout(12000),
    ]);
    try {
      const response = await fetch("/api/joca/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        signal,
        body: JSON.stringify({
          message,
          history: this.history,
          consent: "gemini-free-v1",
        }),
      });
      if (!response.ok) throw new Error("unavailable");
      const value = await response.json();
      if (
        typeof value.text !== "string" ||
        !value.text.trim() ||
        value.text.length > 2000
      )
        throw new Error("invalid_response");
      if (context.signal.aborted || generation !== this.generation)
        throw new Error("cancelled");
      this.history = [
        ...this.history,
        { role: "user" as const, text: message },
        { role: "assistant" as const, text: value.text },
      ].slice(-6);
      return { text: value.text };
    } catch {
      if (context.signal.aborted || generation !== this.generation)
        throw new Error("cancelled");
      this.history = [];
      const fallback = await this.local.reply(message, context);
      return {
        ...fallback,
        text:
          "A IA está indisponível agora. Vou ajudar com uma resposta local; você também pode falar com a escola pelo WhatsApp.\n\n" +
          fallback.text,
      };
    }
  }
}
