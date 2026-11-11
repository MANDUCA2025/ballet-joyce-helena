import { systemInstruction } from "../../../server/knowledge";
export const MODEL = "@cf/google/gemma-4-26b-a4b-it";
export const CF_CONSENT = "cloudflare-poc-v1";
export type Payload = {
  message: string;
  history: { role: "user" | "assistant"; text: string }[];
};
export type InferenceInput = {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  max_completion_tokens: number;
  temperature: number;
  stream: false;
  store: false;
};
export type LocalSettings = {
  LOCAL_BRIDGE_TOKEN?: string;
  ALLOW_REAL_INFERENCE?: string;
  LICENSE_PRIVACY_REVIEWED?: string;
  ACCOUNT_QUOTA_VERIFIED?: string;
};
class SafeError extends Error {
  constructor(readonly status: number) {
    super("request_failed");
  }
}
export function validate(value: unknown): Payload {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new SafeError(400);
  const v = value as Record<string, unknown>;
  if (v.consent !== CF_CONSENT) throw new SafeError(403);
  if (
    Object.keys(v).some(
      (key) => !["message", "history", "consent"].includes(key),
    ) ||
    typeof v.message !== "string" ||
    !v.message.trim() ||
    v.message.length > 500 ||
    !Array.isArray(v.history) ||
    v.history.length > 6 ||
    v.history.length % 2
  )
    throw new SafeError(400);
  const history = v.history.map((turn: unknown, i: number) => {
    if (!turn || typeof turn !== "object") throw new SafeError(400);
    const t = turn as Record<string, unknown>;
    if (
      Object.keys(t).some((key) => !["role", "text"].includes(key)) ||
      t.role !== (i % 2 ? "assistant" : "user") ||
      typeof t.text !== "string" ||
      !t.text.trim() ||
      t.text.length > (i % 2 ? 2000 : 500)
    )
      throw new SafeError(400);
    return { role: t.role as "user" | "assistant", text: t.text };
  });
  return { message: v.message.trim(), history };
}
async function body(request: Request): Promise<unknown> {
  if (!request.body || Number(request.headers.get("content-length")) > 16000)
    throw new SafeError(413);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const reading = async () => {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 16000) throw new SafeError(413);
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      try {
        return JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        throw new SafeError(400);
      }
    };
    return await Promise.race([
      reading(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          void reader.cancel().catch(() => {});
          reject(new SafeError(408));
        }, 3000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => {});
  }
}
async function authenticated(request: Request, token?: string) {
  const supplied = request.headers
    .get("Authorization")
    ?.replace(/^Bearer /, "");
  if (!token || token.length < 32 || !supplied || supplied.length > 256)
    return false;
  // Hashes de tamanho fixo e comparação sem saída antecipada; segredo só entre processos locais.
  const hashes = await Promise.all(
    [token, supplied].map(
      async (value) =>
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(value),
          ),
        ),
    ),
  );
  let difference = 0;
  for (let i = 0; i < 32; i++) difference |= hashes[0][i] ^ hashes[1][i];
  return difference === 0;
}
export function createHandler(
  options: {
    mock?: boolean;
    timeoutMs?: number;
    now?: () => number;
    perMinute?: number;
    total?: number;
  } = {},
) {
  // Contadores somente da POC local; nenhum conteúdo de conversa em estado global.
  const now = options.now ?? Date.now;
  let windowStart = now(),
    count = 0,
    total = 0,
    inFlight = false;
  return async (
    request: Request,
    env: LocalSettings,
    run: (input: InferenceInput) => Promise<unknown>,
  ): Promise<Response> => {
    const json = (status: number, value: unknown) =>
      Response.json(value, {
        status,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    try {
      const url = new URL(request.url);
      if (
        url.origin !== "http://127.0.0.1:8787" ||
        request.headers.has("X-Forwarded-For") ||
        request.headers.has("Forwarded")
      )
        throw new SafeError(403);
      if (url.pathname === "/__local_health" && request.method === "GET")
        return json(200, {
          localOnly: true,
          simulation: options.mock === true,
        });
      if (url.pathname !== "/api/joca/chat") throw new SafeError(404);
      if (request.method !== "POST") throw new SafeError(405);
      if (
        request.headers.get("Origin") !== "http://127.0.0.1:5174" ||
        !(await authenticated(request, env.LOCAL_BRIDGE_TOKEN))
      )
        throw new SafeError(403);
      if (
        request.headers.get("X-Joca-Mode") !==
        (options.mock ? "mock" : "remote")
      )
        throw new SafeError(403);
      if (
        !options.mock &&
        !(
          env.ALLOW_REAL_INFERENCE === "true" &&
          env.LICENSE_PRIVACY_REVIEWED === "true" &&
          env.ACCOUNT_QUOTA_VERIFIED === "true"
        )
      )
        throw new SafeError(503);
      if (now() - windowStart >= 60000) {
        windowStart = now();
        count = 0;
      }
      if (
        count >= (options.perMinute ?? 3) ||
        total >= (options.total ?? 10) ||
        inFlight
      )
        throw new SafeError(429);
      count++;
      total++;
      if (
        !/^application\/json(?:;|$)/i.test(
          request.headers.get("Content-Type") ?? "",
        ) ||
        request.headers.has("Content-Encoding")
      )
        throw new SafeError(415);
      const payload = validate(await body(request));
      if (inFlight) throw new SafeError(429);
      inFlight = true;
      let timer: ReturnType<typeof setTimeout> | undefined;
      // Não liberar a concorrência até a operação terminar: timeout não cancela inferência remota.
      const pending = Promise.resolve()
        .then(() =>
          run({
            messages: [
              { role: "system", content: systemInstruction },
              ...payload.history.map((turn) => ({
                role: turn.role,
                content: turn.text,
              })),
              { role: "user", content: payload.message },
            ],
            max_completion_tokens: 256,
            temperature: 0.2,
            stream: false,
            store: false,
          }),
        )
        .finally(() => {
          inFlight = false;
        });
      try {
        const result = await Promise.race([
          pending,
          new Promise<never>((_, reject) => {
            timer = setTimeout(
              () => reject(new SafeError(504)),
              options.timeoutMs ?? 8000,
            );
          }),
        ]);
        // Formato chat completions documentado para Gemma 4.
        if (
          !result ||
          typeof result !== "object" ||
          !("choices" in result) ||
          !Array.isArray(result.choices)
        )
          throw new SafeError(502);
        const choice = result.choices[0];
        const text: unknown = choice?.message?.content;
        if (
          choice?.finish_reason !== "stop" ||
          typeof text !== "string" ||
          !text.trim() ||
          text.length > 2000 ||
          (env.LOCAL_BRIDGE_TOKEN && text.includes(env.LOCAL_BRIDGE_TOKEN))
        )
          throw new SafeError(502);
        return json(200, { text: text.trim() });
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      const status =
        error instanceof SafeError
          ? error.status
          : error &&
              typeof error === "object" &&
              "status" in error &&
              error.status === 429
            ? 429
            : 503;
      return json(status, {
        error:
          status === 429
            ? "rate_limited"
            : status === 504
              ? "timeout"
              : "unavailable",
      });
    }
  };
}
