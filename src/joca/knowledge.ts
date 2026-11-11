import { content } from "../content";
export const jocaKnowledge = {
  school: content.brand.name + " — " + content.brand.subtitle,
  founder: "Joyce Helena dos Santos",
  modalities: content.modalities.items.map((item, index) => ({
    ...item,
    min: [2, 4, 7, 10][index],
    max: [3, 6, 10, 13][index],
  })),
  address:
    content.contact.location.name + " " + content.contact.location.address,
  mapUrl: content.contact.location.mapUrl,
  instagram: content.contact.instagram,
  event: content.event,
  contact: content.contact,
  greeting:
    "Olá! Que alegria ter você aqui! 💖 Eu sou a Jóca, assistente virtual da Escola Joyce Helena. Estou aqui para ajudar você a conhecer nossa escola. Como posso ajudar?",
  disclosure:
    "Atendimento virtual com respostas locais programadas, sem inteligência artificial.",
  privacy:
    "Conversa temporária neste navegador. Não envie documentos ou dados pessoais de crianças.",
};
