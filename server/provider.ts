import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "./knowledge";
export type Turn = { role: "user" | "assistant"; text: string };
export type ProviderInput = {
  message: string;
  history: Turn[];
  signal: AbortSignal;
};
export type Provider = (input: ProviderInput) => Promise<string>;
export function createGeminiProvider(apiKey: string, model: string): Provider {
  const ai = new GoogleGenAI({
    apiKey,
    vertexai: false,
    httpOptions: { timeout: 10000, retryOptions: { attempts: 1 } },
  });
  return async ({ message, history, signal }) => {
    const result = await ai.models.generateContent({
      model,
      contents: [...history, { role: "user", text: message }].map((turn) => ({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.text }],
      })),
      config: {
        systemInstruction,
        maxOutputTokens: 512,
        temperature: 0.2,
        abortSignal: signal,
        // Nenhuma ferramenta, busca, cache persistente ou função habilitada.
      },
    });
    if (result.candidates?.[0]?.finishReason !== "STOP")
      throw new Error("invalid_response");
    return result.text ?? "";
  };
}
