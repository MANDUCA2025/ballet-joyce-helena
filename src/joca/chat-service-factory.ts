import { localChatService, type ChatService } from "./chat-service";
import { GeminiChatService } from "./gemini-chat-service";
import { CloudflareChatService } from "./cloudflare-chat-service";
export type ChatProvider = "gemini" | "cloudflare";
export class ChatServiceFactory {
  readonly gemini: GeminiChatService;
  readonly cloudflare: CloudflareChatService;
  constructor(private local: ChatService = localChatService) {
    this.gemini = new GeminiChatService(local);
    this.cloudflare = new CloudflareChatService(local);
  }
  revoke() {
    this.gemini.revoke();
    this.cloudflare.revoke();
  }
  authorize(provider: ChatProvider) {
    this.revoke();
    this[provider].authorize();
  }
  select(config: {
    available: boolean;
    consent: boolean;
    provider?: ChatProvider;
  }): ChatService {
    return config.available && config.consent
      ? this[config.provider ?? "gemini"]
      : this.local;
  }
}
