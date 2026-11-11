import { jocaKnowledge as k } from "./knowledge";
import { intents, type IntentId } from "./intents";
export type TopicContext = { intent: IntentId; expires: number };
export type ChatReply = {
  text: string;
  links?: { label: string; url: string }[];
  topic?: TopicContext;
  suggestions?: string[];
};
export interface ChatService {
  reply(
    message: string,
    context: { modality?: string; signal: AbortSignal; topic?: TopicContext },
  ): Promise<ChatReply>;
}
export function normalizeQuestion(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\bvc\b/g, "voce")
    .replace(/\bqto\b/g, "quanto")
    .replace(/\bmsg\b/g, "mensagem");
}
function distanceOne(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length >= b.length) i++;
    if (b.length >= a.length) j++;
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
const vocabulary = [
  ...new Set(
    intents.flatMap((i) =>
      i.examples.flatMap((e) => normalizeQuestion(e).split(" ")),
    ),
  ),
];
function correctTypos(q: string) {
  return q
    .split(" ")
    .map((word) => {
      if (
        word.length < 5 ||
        ["contrato", "cancelar"].includes(word) ||
        vocabulary.includes(word)
      )
        return word;
      const candidates = vocabulary.filter(
        (v) => v.length >= 5 && distanceOne(word, v),
      );
      return candidates.length === 1 ? candidates[0] : word;
    })
    .join(" ");
}
export function matchIntents(message: string): IntentId[] {
  const q = correctTypos(normalizeQuestion(message));
  const exact = intents.filter((i) =>
    i.examples.some((e) => normalizeQuestion(e) === q),
  );
  if (exact.length) return exact.map((i) => i.id);
  let matches = intents
    .filter((i) => new RegExp(i.pattern).test(q))
    .map((i) => i.id);
  const suppress = (specific: IntentId[], general: IntentId[]) => {
    if (matches.some((i) => specific.includes(i)))
      matches = matches.filter((i) => !general.includes(i));
  };
  suppress(["age", "choice", "differences"], ["modalities"]);
  if (matches.includes("age")) matches = matches.filter((i) => i !== "choice");
  suppress(["documents"], ["enrollment"]);
  suppress(["billing"], ["prices", "payment"]);
  suppress(["tickets"], ["prices", "shows", "vacancies"]);
  suppress(["costumes"], ["shows"]);
  return matches;
}
const handoff = [
  { label: "Conversar com a equipe", url: k.contact.whatsapp.url },
];
export function answerQuestion(
  message: string,
  modality?: string,
  topic?: TopicContext,
  now = Date.now(),
): ChatReply {
  const q = normalizeQuestion(message);
  if (
    /\b(cpf|rg|bancarios|senha|documento pessoal)\b|dados.*(crianca|aluna|familia)|nome.*(aluna|crianca)|ignore|invente|finja|garanta|confirme.*(vaga|pagamento|matricula)|<|https?:/.test(
      message.toLowerCase(),
    ) ||
    /dados.*crianca/.test(q)
  )
    return {
      text: "Ainda não tenho essa informação confirmada. Não solicito nem forneço dados pessoais ou documentos. Também não invento informações nem confirmo operações. Para orientações oficiais, fale com a equipe pelo WhatsApp.",
      links: handoff,
    };
  let matches = matchIntents(message);
  if (
    !matches.length &&
    /^(e )?(isso|sobre isso|como faco|quero saber mais|pode explicar melhor)$/.test(
      q,
    ) &&
    topic &&
    topic.expires > now
  )
    matches = [topic.intent];
  if (matches.length > 1)
    return {
      text: "Quero orientar você com cuidado. Sobre qual destes assuntos gostaria de conversar primeiro?",
      suggestions: matches
        .slice(0, 3)
        .map((id) => intents.find((i) => i.id === id)!.examples[0]),
    };
  const id = matches[0];
  if (!id)
    return {
      text: "Ainda não tenho essa informação. Posso ajudar com modalidades, endereço, contatos e apresentações. Para confirmar outros detalhes, converse com a equipe da escola pelo WhatsApp abaixo.",
      links: handoff,
      suggestions: ["Conhecer modalidades", "Falar pelo WhatsApp"],
    };
  const entry = intents.find((i) => i.id === id)!;
  let text: string = entry.answer;
  let links = handoff;
  if (id === "modalities")
    text =
      k.modalities.map((m) => m.name).join("; ") +
      ". Consulte nossa equipe para conhecer a modalidade mais indicada. Não definimos turmas por idade neste atendimento.";
  if (id === "schedule")
    text =
      "Para consultar os dias e horários" +
      (k.modalities.some((m) => m.name === modality) ? " de " + modality : "") +
      ", fale com a equipe pelo WhatsApp. Não tenho uma grade atualizada confirmada e não posso confirmar horários ou vagas.";
  if (id === "location" || id === "directions") {
    text = "As aulas acontecem na " + k.address;
    links = [{ label: "Como chegar", url: k.mapUrl }];
  }
  if (id === "contacts" || id === "whatsapp")
    text =
      "Fale com a equipe pelo WhatsApp principal " +
      k.contact.whatsapp.number +
      " ou alternativo " +
      k.contact.alternative.number +
      ". Os links abaixo abrem uma conversa com a escola.";
  if (id === "instagram") {
    text = "Acompanhe a escola no Instagram: " + k.instagram.profile + ".";
    links = [{ label: "Abrir Instagram", url: k.instagram.url }];
  }
  if (id === "founder")
    text = "A fundadora da " + k.school + " é " + k.founder + ". Na equipe: Joyce Helena — Fundadora e Professora.";
  if (id === "team")
    text = k.team.map(({ name, role }) => `${name} — ${role}.`).join(" ") + " Para atendimento, fale com a escola pelo WhatsApp oficial; não compartilho contatos pessoais da equipe.";
  if (id === "shows")
    text =
      k.event.title +
      ". " +
      k.event.text +
      " " +
      k.event.note +
      " Na homepage você também encontra as memórias de apresentações de 2024 e 2025.";
  return {
    text,
    links,
    topic: { intent: id, expires: now + 5 * 60_000 },
    suggestions:
      id === "enrollment" || id === "trial"
        ? [
            "Quanto custa o ballet?",
            "Consultar horários",
            "Falar pelo WhatsApp",
          ]
        : ["Conhecer modalidades", "Falar pelo WhatsApp"],
  };
}
export class LocalChatService implements ChatService {
  async reply(message: string, context: Parameters<ChatService["reply"]>[1]) {
    if (context.signal.aborted) throw new Error("Conversa interrompida");
    return answerQuestion(message, context.modality, context.topic);
  }
}
export const localChatService: ChatService = new LocalChatService();
