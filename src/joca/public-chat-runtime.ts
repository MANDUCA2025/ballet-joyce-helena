import { localChatService, type ChatService } from "./chat-service";
export type ChatProvider = "gemini" | "cloudflare";
export const PUBLIC_CHAT = true;
// Adaptador de produção: nunca importa serviços remotos ou usa fetch.
export class ChatServiceFactory {
  constructor(private local: ChatService = localChatService) {}
  select() {
    return this.local;
  }
  authorize() {}
  revoke() {}
}
