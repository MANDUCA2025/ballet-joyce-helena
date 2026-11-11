import { ResponsiveImage } from "../ResponsiveImage";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChatReply, ChatService, TopicContext } from "./chat-service";
import {
  ChatServiceFactory,
  PUBLIC_CHAT,
  type ChatProvider,
} from "./chat-runtime";
import { localChatService } from "./chat-service";
import { initialQuestions } from "./intents";
import { jocaKnowledge as k } from "./knowledge";
import { scheduleContactUrl } from "../schedule-contact";
import "./joca-chat.css";
export type JocaRequest = { trigger: HTMLButtonElement; modality?: string };
type Message = ChatReply & {
  role: "user" | "assistant";
  id: number;
  retry?: { text: string; modality?: string };
};
export function JocaChat({
  request,
  onOpen,
  onClose,
  service = localChatService,
}: {
  request: JocaRequest | null;
  onOpen: (request: JocaRequest) => void;
  onClose: () => void;
  service?: ChatService;
}) {
  const [factory] = useState(() => new ChatServiceFactory(service));
  const [available, setAvailable] = useState(false);
  const [provider, setProvider] = useState<ChatProvider>("gemini");
  const [simulation, setSimulation] = useState(false);
  const [consent, setConsent] = useState(false);
  const aiMode = useRef(false);
  const topic = useRef<TopicContext | undefined>(undefined);
  useEffect(() => {
    if (PUBLIC_CHAT || !request) return;
    const controller = new AbortController();
    void fetch("/api/joca/config", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (!controller.signal.aborted) {
          setAvailable(value?.available === true);
          setProvider(
            value?.provider === "cloudflare" ? "cloudflare" : "gemini",
          );
          setSimulation(value?.simulation === true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, [request]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: k.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const followEnd = useRef(false);
  const savedScroll = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    closeButton = useRef<HTMLButtonElement>(null),
    log = useRef<HTMLDivElement>(null);
  const nextId = useRef(1),
    active = useRef<AbortController | null>(null);
  async function send(
    text: string,
    modality = request?.modality,
    retryId?: number,
  ) {
    const clean = text.trim().slice(0, 500);
    if (!clean || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    followEnd.current = true;
    setUnread(false);
    if (retryId !== undefined) {
      setMessages((previous) =>
        previous.filter((message) => message.id !== retryId),
      );
      input.current?.focus({ preventScroll: true });
    } else {
      setMessages((previous) => [
        ...previous.slice(-49),
        { id: nextId.current++, role: "user", text: clean },
      ]);
    }
    setDraft("");
    setBusy(true);
    try {
      const reply = await factory
        .select({
          available: aiMode.current,
          consent: aiMode.current,
          provider,
        })
        .reply(clean, {
          modality,
          topic: topic.current,
          signal: controller.signal,
        });
      if (!controller.signal.aborted) {
        topic.current = reply.topic;
        if (!followEnd.current) setUnread(true);
        setMessages((previous) => [
          ...previous.slice(-49),
          { id: nextId.current++, role: "assistant", ...reply },
        ]);
      }
    } catch {
      if (!controller.signal.aborted) {
        if (!followEnd.current) setUnread(true);
        setMessages((previous) => [
          ...previous.slice(-49),
          {
            id: nextId.current++,
            role: "assistant",
            retry: { text: clean, modality },
            text: "Não consegui preparar a resposta agora. Você pode falar diretamente com a escola pelos contatos abaixo.",
          },
        ]);
      }
    } finally {
      if (active.current === controller) {
        active.current = null;
        setBusy(false);
      }
    }
  }
  useLayoutEffect(() => {
    if (!request) return;
    const element = dialog.current!;
    const body = document.body;
    const root = document.documentElement;
    const scroll = { x: window.scrollX, y: window.scrollY };
    const properties = [
      "position",
      "top",
      "left",
      "width",
      "overflow",
      "paddingRight",
    ] as const;
    const oldBody = Object.fromEntries(
      properties.map((property) => [property, body.style[property]]),
    );
    const oldRootOverflow = root.style.overflow;
    const gutter = window.innerWidth - root.clientWidth;
    const padding =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.position = "fixed";
    body.style.top = -scroll.y + "px";
    body.style.left = -scroll.x + "px";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = padding + gutter + "px";
    root.style.overflow = "hidden";
    element.showModal();
    (window.matchMedia("(max-width: 767px)").matches
      ? closeButton.current
      : input.current
    )?.focus({ preventScroll: true });
    if (log.current) log.current.scrollTop = savedScroll.current;
    const viewport = window.visualViewport;
    const resize = () => {
      const pinned = followEnd.current;
      element.style.setProperty(
        "--joca-height",
        (viewport?.height ?? window.innerHeight) + "px",
      );
      element.style.setProperty(
        "--joca-top",
        (viewport?.offsetTop ?? 0) + "px",
      );
      element.style.setProperty(
        "--joca-width",
        (viewport?.width ?? window.innerWidth) + "px",
      );
      element.style.setProperty(
        "--joca-left",
        (viewport?.offsetLeft ?? 0) + "px",
      );
      element.dataset.compact = String(
        (viewport?.height ?? window.innerHeight) < 360,
      );
      if (pinned && log.current)
        log.current.scrollTop = log.current.scrollHeight;
    };
    let frame: number | null = null;
    const queueResize = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        resize();
      });
    };
    resize();
    window.addEventListener("resize", queueResize);
    viewport?.addEventListener("resize", queueResize);
    viewport?.addEventListener("scroll", queueResize);
    if (request.modality)
      void send(
        "Gostaria de consultar os horários do " + request.modality,
        request.modality,
      );
    return () => {
      factory.revoke();
      topic.current = undefined;
      aiMode.current = false;
      setConsent(false);
      active.current?.abort();
      active.current = null;
      setBusy(false);
      savedScroll.current = log.current?.scrollTop ?? savedScroll.current;
      element.close();
      for (const property of properties)
        body.style[property] = oldBody[property];
      root.style.overflow = oldRootOverflow;
      window.scrollTo({ left: scroll.x, top: scroll.y, behavior: "instant" });
      window.removeEventListener("resize", queueResize);
      viewport?.removeEventListener("resize", queueResize);
      viewport?.removeEventListener("scroll", queueResize);
      if (frame !== null) window.cancelAnimationFrame(frame);
      request.trigger.focus({ preventScroll: true });
    };
  }, [request]);
  useLayoutEffect(() => {
    if (log.current && followEnd.current)
      log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy, request]);
  const disclosure = (
    <div className="joca-disclosure" id="joca-chat-disclosure">
      {!PUBLIC_CHAT && consent
        ? provider === "cloudflare"
          ? simulation
            ? "Simulação local, sem inteligência artificial e sem envio à Cloudflare."
            : "Inteligência artificial via Cloudflare Workers AI. Confirme informações com a escola."
          : "Inteligência artificial Gemini (Google). Respostas podem conter erros; confirme informações com a escola."
        : k.disclosure}
      <small>{k.privacy}</small>
      {!PUBLIC_CHAT && available && (
        <div className="joca-ai-consent">
          {consent ? (
            <button
              type="button"
              className="joca-retry"
              onClick={() => {
                active.current?.abort();
                active.current = null;
                setBusy(false);
                factory.revoke();
                aiMode.current = false;
                setConsent(false);
              }}
            >
              Voltar ao atendimento local
            </button>
          ) : (
            <>
              {provider === "cloudflare" ? (
                <>
                  <p>
                    {simulation
                      ? "Modo simulado: respostas programadas executadas no Worker local, sem inferência e sem consumo de cota. Use apenas perguntas fictícias e institucionais."
                      : "A IA é opcional. Suas próximas mensagens serão processadas pela Cloudflare Workers AI, fora deste computador. Não envie dados pessoais ou de crianças. O histórico local anterior não será enviado. Você pode continuar no atendimento local ou usar o WhatsApp."}
                  </p>
                  <a
                    href="https://developers.cloudflare.com/workers-ai/platform/data-usage/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Uso de dados do Workers AI (nova aba)
                  </a>
                </>
              ) : (
                <>
                  <p>
                    A IA é opcional. Ao autorizar, suas próximas mensagens serão
                    enviadas ao Google Gemini. No nível gratuito, mensagens e
                    respostas podem ser usadas para melhorar produtos e lidas
                    por revisores humanos. Não envie informações pessoais,
                    sensíveis ou de crianças. O histórico local anterior não
                    será enviado. Você pode continuar no atendimento local ou
                    usar o WhatsApp.
                  </p>
                  <a
                    href="https://ai.google.dev/gemini-api/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Termos e uso de dados do Gemini (nova aba)
                  </a>
                </>
              )}
              <button
                type="button"
                className="joca-retry"
                disabled={busy}
                onClick={() => {
                  factory.authorize(provider);
                  aiMode.current = true;
                  setConsent(true);
                  setDraft("");
                  input.current?.focus({ preventScroll: true });
                }}
              >
                {provider === "cloudflare" && simulation
                  ? "Iniciar simulação local"
                  : "Autorizar envio das próximas mensagens à IA"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
  return (
    <>
      <button
        type="button"
        className="joca-launcher"
        aria-haspopup="dialog"
        aria-expanded={!!request}
        style={request ? { visibility: "hidden" } : undefined}
        onClick={(event) => onOpen({ trigger: event.currentTarget })}
      >
        <span>Fale com a Jóca</span>
        <ResponsiveImage
          sizes="64px"
          src="/images/joca-avatar.png"
          width="60"
          height="60"
          alt=""
        />
      </button>
      {request && (
        <dialog
          ref={dialog}
          className="joca-chat"
          aria-labelledby="joca-chat-title"
          aria-describedby="joca-chat-disclosure"
          onCancel={(event) => {
            event.preventDefault();
            onClose();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const nodes = Array.from(
              dialog.current!.querySelectorAll<HTMLElement>(
                "button:not(:disabled), a[href], input",
              ),
            );
            const first = nodes[0],
              last = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
        >
          <header className="joca-chat-header">
            <ResponsiveImage
              sizes="64px"
              src="/images/joca-avatar.png"
              width="44"
              height="44"
              alt=""
            />
            <div>
              <h2 id="joca-chat-title">Jóca</h2>
              <p>Assistente Virtual da Escola Joyce Helena</p>
            </div>
            <button
              type="button"
              ref={closeButton}
              aria-label="Fechar conversa com a Jóca"
              onClick={onClose}
            >
              ×
            </button>
          </header>
          <div
            ref={log}
            className="joca-messages"
            role="log"
            aria-label="Histórico da conversa"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={busy}
            onScroll={() => {
              const element = log.current!;
              followEnd.current =
                element.scrollHeight -
                  element.scrollTop -
                  element.clientHeight <
                32;
              if (followEnd.current) setUnread(false);
            }}
          >
            {messages[0]?.id !== 0 && disclosure}
            {messages.map((message) => (
              <Fragment key={message.id}>
                <div className={"joca-message " + message.role}>
                  <span className="joca-speaker">
                    {message.role === "user" ? "Você" : "Jóca"}
                  </span>
                  <p>{message.text}</p>
                  {message.retry && (
                    <button
                      className="joca-retry"
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void send(
                          message.retry!.text,
                          message.retry!.modality,
                          message.id,
                        )
                      }
                    >
                      Tentar novamente
                    </button>
                  )}
                  {message.links?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label} ↗<span className="sr-only"> (nova aba)</span>
                    </a>
                  ))}
                </div>
                {message.id === 0 && disclosure}
              </Fragment>
            ))}
            <nav className="joca-quick" aria-label="Sugestões de perguntas">
              {(messages.length === 1
                ? initialQuestions
                : (messages.at(-1)?.suggestions ?? [
                    "Conhecer modalidades",
                    "Falar pelo WhatsApp",
                  ])
              ).map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    input.current?.focus({ preventScroll: true });
                    void send(question);
                  }}
                >
                  {question}
                </button>
              ))}
            </nav>
          </div>
          <div className="joca-response-status">
            <span role="status">
              {busy
                ? !PUBLIC_CHAT && consent
                  ? "Consultando a IA…"
                  : "Consultando respostas locais…"
                : !PUBLIC_CHAT && consent
                  ? provider === "cloudflare"
                    ? simulation
                      ? "Simulação local · sem IA"
                      : "IA Cloudflare · uso autorizado"
                    : "IA Gemini · uso autorizado"
                  : "Respostas locais · sem IA"}
            </span>
            {unread && (
              <button
                type="button"
                className="joca-latest"
                onClick={() => {
                  followEnd.current = true;
                  setUnread(false);
                  if (log.current)
                    log.current.scrollTop = log.current.scrollHeight;
                }}
              >
                Ver última resposta ↓
              </button>
            )}
          </div>
          <nav
            className="joca-handoff"
            aria-label="Falar com a escola pelo WhatsApp"
          >
            <a
              href={
                request.modality
                  ? scheduleContactUrl(request.modality, "whatsapp")!
                  : k.contact.whatsapp.url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp principal ↗
            </a>
            <a
              href={k.contact.alternative.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Alternativo ↗
            </a>
          </nav>
          <form
            className="joca-compose"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <label htmlFor="joca-question" className="sr-only">
              Mensagem para a Jóca
            </label>
            <input
              ref={input}
              id="joca-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Como posso ajudar?"
              autoComplete="off"
              enterKeyHint="send"
              maxLength={500}
            />
            <button type="submit" disabled={!draft.trim() || busy}>
              Enviar
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}
