import type { IncomingMessage, ServerResponse } from "node:http";
import { Buffer } from "node:buffer";
import { setTimeout, clearTimeout } from "node:timers";
import type { Provider, Turn } from "./provider";
export type ServerConfig = {
  enabled: boolean;
  eligibilityReviewed: boolean;
  freeTierConfirmed: boolean;
  apiKey: string;
  model: string;
  origin: string;
};
export function readConfig(
  env: Record<string, string | undefined>,
): ServerConfig {
  const origin = env.JOCA_ALLOWED_ORIGIN ?? "http://127.0.0.1:5174";
  if (!["http://127.0.0.1:5174", "http://localhost:5174"].includes(origin))
    throw new Error("A origem deve ser local na porta 5174.");
  return {
    enabled: env.JOCA_AI_ENABLED === "true",
    eligibilityReviewed: env.JOCA_ELIGIBILITY_REVIEWED === "true",
    freeTierConfirmed: env.JOCA_FREE_TIER_CONFIRMED === "true",
    apiKey: env.GEMINI_API_KEY ?? "",
    model: env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
    origin,
  };
}
export const CONSENT_VERSION = "gemini-free-v1";
export function isAvailable(c: ServerConfig) {
  return !!(
    c.enabled &&
    c.eligibilityReviewed &&
    c.freeTierConfirmed &&
    c.apiKey &&
    c.model
  );
}
class RequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}
function validText(value: unknown, max: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= max &&
    !Array.from(value).some(
      (char) =>
        char.charCodeAt(0) < 32 && ![9, 10, 13].includes(char.charCodeAt(0)),
    )
  );
}
export function validatePayload(
  value: unknown,
  consentVersion = CONSENT_VERSION,
): {
  message: string;
  history: Turn[];
} {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new RequestError(400, "invalid_request");
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).some(
      (key) => !["message", "history", "consent"].includes(key),
    )
  )
    throw new RequestError(400, "invalid_request");
  if (v.consent !== consentVersion)
    throw new RequestError(403, "consent_required");
  if (
    !validText(v.message, 500) ||
    !Array.isArray(v.history) ||
    v.history.length > 6 ||
    v.history.length % 2
  )
    throw new RequestError(400, "invalid_request");
  const history = v.history.map((item: unknown, i: number) => {
    if (!item || typeof item !== "object")
      throw new RequestError(400, "invalid_request");
    const t = item as Record<string, unknown>;
    if (
      Object.keys(t).some((key) => !["role", "text"].includes(key)) ||
      t.role !== (i % 2 ? "assistant" : "user") ||
      !validText(t.text, i % 2 ? 2000 : 500)
    )
      throw new RequestError(400, "invalid_request");
    return { role: t.role as Turn["role"], text: t.text.trim() };
  });
  return { message: v.message.trim(), history };
}
function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks: Buffer[] = [];
    const done = (error?: Error, value?: unknown) => {
      clearTimeout(timer);
      req.off("data", data);
      req.off("end", end);
      req.off("error", fail);
      req.off("aborted", aborted);
      if (error) {
        req.resume();
        reject(error);
      } else resolve(value);
    };
    const data = (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > 16000) done(new RequestError(413, "request_too_large"));
      else chunks.push(chunk);
    };
    const end = () => {
      try {
        done(undefined, JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        done(new RequestError(400, "invalid_request"));
      }
    };
    const fail = () => done(new RequestError(400, "invalid_request"));
    const aborted = () => fail();
    const timer = setTimeout(
      () => done(new RequestError(408, "request_timeout")),
      5000,
    );
    req.on("data", data);
    req.once("end", end);
    req.once("error", fail);
    req.once("aborted", aborted);
  });
}
export function createChatEndpoint(
  config: ServerConfig,
  provider: Provider,
  options: {
    consentVersion?: string;
    providerName?: "cloudflare";
    simulation?: boolean;
    timeoutMs?: number;
    now?: () => number;
    perOrigin?: number;
    global?: number;
    daily?: number;
  } = {},
) {
  const now = options.now ?? Date.now;
  let minute = now(),
    day = now(),
    global = 0,
    daily = 0,
    active = 0;
  const origins = new Map<string, number>();
  function take(origin: string) {
    const time = now();
    if (time - minute >= 60000) {
      minute = time;
      global = 0;
      origins.clear();
    }
    if (time - day >= 86400000) {
      day = time;
      daily = 0;
    }
    if (
      global >= (options.global ?? 20) ||
      daily >= (options.daily ?? 100) ||
      (origins.get(origin) ?? 0) >= (options.perOrigin ?? 6) ||
      active >= 2
    )
      throw new RequestError(429, "rate_limited");
    global++;
    daily++;
    origins.set(origin, (origins.get(origin) ?? 0) + 1);
  }
  return async (req: IncomingMessage, res: ServerResponse) => {
    const json = (status: number, value: unknown) => {
      if (res.destroyed) return;
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...(status === 429 ? { "Retry-After": "60" } : {}),
      });
      res.end(JSON.stringify(value));
    };
    try {
      const path = (req.url ?? "").split("?")[0];
      if (
        req.headers.host !== new URL(config.origin).host ||
        (req.headers["sec-fetch-site"] &&
          req.headers["sec-fetch-site"] !== "same-origin")
      )
        throw new RequestError(403, "origin_denied");
      if (req.headers.origin && req.headers.origin !== config.origin)
        throw new RequestError(403, "origin_denied");
      if (path === "/api/joca/config" && req.method === "GET") {
        json(200, {
          available: isAvailable(config),
          ...(options.providerName
            ? {
                provider: options.providerName,
                simulation: options.simulation === true,
              }
            : {}),
        });
        return;
      }
      if (path !== "/api/joca/chat") throw new RequestError(404, "not_found");
      if (req.method !== "POST")
        throw new RequestError(405, "method_not_allowed");
      if (req.headers.origin !== config.origin)
        throw new RequestError(403, "origin_denied");
      take(config.origin);
      if (!isAvailable(config)) throw new RequestError(503, "unavailable");
      if (
        !/^application\/json(?:;|$)/i.test(req.headers["content-type"] ?? "") ||
        req.headers["content-encoding"]
      )
        throw new RequestError(415, "invalid_request");
      if (Number(req.headers["content-length"]) > 16000)
        throw new RequestError(413, "request_too_large");
      const payload = validatePayload(
        await readBody(req),
        options.consentVersion,
      );
      // Verificação novamente após a leitura assíncrona impede ultrapassar concorrência.
      if (active >= 2) throw new RequestError(429, "rate_limited");
      active++;
      const controller = new AbortController();
      const disconnected = () => controller.abort();
      res.once("close", disconnected);
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new RequestError(504, "timeout"));
          }, options.timeoutMs ?? 10000);
        });
        const text = await Promise.race([
          provider({ ...payload, signal: controller.signal }),
          timeout,
        ]);
        if (!validText(text, 2000) || text.includes(config.apiKey))
          throw new RequestError(502, "invalid_response");
        json(200, { text: text.trim() });
      } finally {
        clearTimeout(timer);
        res.off("close", disconnected);
        active--;
      }
    } catch (error) {
      // Não registrar nem devolver erros do SDK: podem incluir payloads e credenciais.
      if (error instanceof RequestError)
        json(error.status, { error: error.code });
      else if (
        typeof error === "object" &&
        error &&
        "status" in error &&
        error.status === 429
      )
        json(429, { error: "rate_limited" });
      else json(503, { error: "unavailable" });
    }
  };
}
