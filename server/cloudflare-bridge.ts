import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createChatEndpoint, type ServerConfig } from "./chat-endpoint";
import type { Provider } from "./provider";
// Destino fixo em loopback: não aceita URLs externas nem redirecionamentos.
export function createCloudflareProvider(
  token: string,
  mode: "mock" | "remote" = "mock",
): Provider {
  return async ({ message, history, signal }) => {
    const response = await fetch("http://127.0.0.1:8787/api/joca/chat", {
      method: "POST",
      redirect: "error",
      signal,
      headers: {
        "Content-Type": "application/json",
        Origin: "http://127.0.0.1:5174",
        Authorization: "Bearer " + token,
        "X-Joca-Mode": mode,
      },
      body: JSON.stringify({ message, history, consent: "cloudflare-poc-v1" }),
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw Object.assign(new Error("worker_unavailable"), {
        status: response.status,
      });
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("invalid_response");
    let size = 0,
      text = "";
    const decoder = new TextDecoder();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 12000) throw new Error("invalid_response");
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
      const parsed = JSON.parse(text);
      if (typeof parsed.text !== "string" || parsed.text.length > 2000)
        throw new Error("invalid_response");
      return parsed.text;
    } finally {
      await reader.cancel();
    }
  };
}
export function cloudflareEndpoint(env: Record<string, string>, root: string) {
  let token = "";
  try {
    token = readFileSync(
      join(root, ".local/cloudflare/bridge-token"),
      "utf8",
    ).trim();
  } catch {
    /* ausência mantém fallback */
  }
  const simulation = env.JOCA_CF_MODE === "mock";
  const real =
    env.JOCA_CF_MODE === "remote" &&
    env.JOCA_CF_REAL_AUTHORIZED === "true" &&
    env.JOCA_CF_PRIVACY_REVIEWED === "true" &&
    env.JOCA_CF_QUOTA_VERIFIED === "true";
  const config: ServerConfig = {
    enabled: simulation || real,
    eligibilityReviewed: true,
    freeTierConfirmed: true,
    apiKey: token.length >= 32 ? token : "",
    model: "@cf/google/gemma-4-26b-a4b-it",
    origin: "http://127.0.0.1:5174",
  };
  return createChatEndpoint(
    config,
    createCloudflareProvider(token, simulation ? "mock" : "remote"),
    {
      consentVersion: "cloudflare-poc-v1",
      providerName: "cloudflare",
      simulation,
      perOrigin: 3,
      global: 3,
      daily: 10,
    },
  );
}
