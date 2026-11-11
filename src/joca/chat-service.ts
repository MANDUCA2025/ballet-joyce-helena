import { jocaKnowledge as k } from "./knowledge";
export type ChatReply = {
  text: string;
  links?: { label: string; url: string }[];
};
export interface ChatService {
  reply(
    message: string,
    context: { modality?: string; signal: AbortSignal },
  ): Promise<ChatReply>;
}
export function answerQuestion(message: string, modality?: string): ChatReply {
  const q = message.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const confirm =
    "As faixas etárias ainda precisam de confirmação final. A escola pode orientar o melhor caminho para cada criança.";
  const schedule = () => ({
    text:
      "Para consultar os dias e horários" +
      (modality ? " de " + modality : "") +
      ", fale com a equipe pelo WhatsApp. Não tenho uma grade atualizada confirmada e não posso confirmar horários ou vagas.",
  });
  if (/horario|dias? de aula|quando.*aula|que horas/.test(q)) return schedule();
  if (/experimental|agendar|agendamento|matricula|vaga/.test(q))
    return {
      text: "Você pode solicitar informações e agendamento de uma aula experimental pelo WhatsApp da escola. A equipe confirma os horários e a disponibilidade; esta conversa não realiza matrícula nem garante vaga.",
    };
  const ageMatch = q.match(/\b(\d{1,2})\s*anos?\b/);
  if (ageMatch) {
    const age = Number(ageMatch[1]),
      matches = k.modalities.filter((m) => age >= m.min && age <= m.max);
    return {
      text: matches.length
        ? "Para " +
          age +
          " anos, o material informado contempla " +
          matches.map((m) => m.name).join(" e ") +
          ". " +
          (matches.length > 1
            ? "Há sobreposição entre essas faixas; não posso definir a turma automaticamente. "
            : "") +
          confirm
        : "Essa idade não está contemplada nas faixas informadas. Isso não define uma restrição de matrícula. Consulte a escola para uma orientação individual, sem enviar dados pessoais da criança aqui.",
    };
  }
  if (
    /modalidade|idade|baby|pre.?ballet|infantil|preparatorio|curso|turma/.test(
      q,
    )
  )
    return {
      text:
        k.modalities.map((m) => m.name + ": " + m.ageRange).join("; ") +
        ". " +
        confirm,
    };
  if (/onde|endereco|localiza|como chegar|fica a escola/.test(q))
    return {
      text: "As aulas acontecem na " + k.address,
      links: [{ label: "Como chegar", url: k.mapUrl }],
    };
  if (/instagram|rede social/.test(q))
    return {
      text: "Acompanhe a escola no Instagram: " + k.instagram.profile + ".",
      links: [{ label: "Abrir Instagram", url: k.instagram.url }],
    };
  if (/espetaculo|apresentac|quatro estac|ingresso/.test(q))
    return {
      text:
        k.event.title +
        ". " +
        k.event.text +
        " " +
        k.event.note +
        " Na homepage você também encontra as memórias de apresentações de 2024 e 2025.",
    };
  if (/fundadora|quem.*joyce|quem.*fundou/.test(q))
    return { text: "A fundadora da " + k.school + " é " + k.founder + "." };
  if (/contato|telefone|whatsapp|falar.*escola/.test(q))
    return {
      text:
        "Fale com a equipe pelo WhatsApp principal " +
        k.contact.whatsapp.number +
        " ou alternativo " +
        k.contact.alternative.number +
        ". Os links abaixo abrem uma conversa com a escola.",
    };
  if (/^(oi|ola|bom dia|boa tarde|boa noite|obrigad[oa])[!.\s]*$/.test(q))
    return {
      text: "Que bom conversar com você! Posso ajudar com modalidades, endereço, aula experimental, contatos e o espetáculo Quatro Estações 2026.",
    };
  return {
    text: "Ainda não tenho essa informação. Posso ajudar com modalidades, endereço, contatos e apresentações. Para confirmar outros detalhes, converse com a equipe da escola pelo WhatsApp abaixo.",
  };
}
// Respostas locais sem rede, chaves ou persistência.
export class LocalChatService implements ChatService {
  async reply(message: string, context: Parameters<ChatService["reply"]>[1]) {
    if (context.signal.aborted) throw new Error("Conversa interrompida");
    return answerQuestion(message, context.modality);
  }
}
export const localChatService: ChatService = new LocalChatService();
