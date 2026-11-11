export const schoolTeam = [
  { name: "Joyce Helena", role: "Fundadora e Professora" },
  { name: "Ester Rodrigues", role: "Professora" },
  { name: "Mary", role: "Auxiliar" },
  { name: "Natália Ramos", role: "Administração Geral" },
];
export const trialMessage =
  "Olá! Vim pelo site da Escola Joyce Helena e gostaria de informações para agendar uma aula experimental.";
export const whatsappUrl = (number: string) =>
  "https://wa.me/" + number + "?text=" + encodeURIComponent(trialMessage);
// Conteúdo editorial: editar aqui, revisar e aprovar antes da publicação.
// Nunca marcar uma fotografia como autorizada sem verificar a autorização real,
// incluindo responsáveis legais quando houver crianças. Não inserir dados pessoais de alunos.
export type AuthorizedPhoto = {
  src: string | null;
  alt: string;
  caption: string;
  authorized: boolean;
};
export type Modality = {
  name: string;
  tagline: string;
  symbol: string;
  ageRange: string | null;
  description: string | null;
};
export const content = {
  brand: {
    name: "Joyce Helena",
    subtitle: "Escola de Ballet",
    logo: "/images/logo-joyce-helena.jpg",
  },
  navigation: [
    ["modalidades", "Modalidades"],
    ["escola", "Nossa escola"],
    ["espetaculos", "Espetáculos"],
    ["joca", "Jóca"],
    ["contato", "Contato"],
  ],
  hero: {
    photo: {
      src: "/images/hero-joyce-helena.png",
      alt: "Fotografia oficial da Escola Joyce Helena, com uma bailarina em traje de apresentação",
      width: 1448,
      height: 1086,
      authorized: true,
    },
    eyebrow: "JOYCE HELENA · ESCOLA DE BALLET",
    firstLine: "Onde pequenos passos",
    secondLine: "se transformam em",
    accent: "grandes sonhos.",
    description:
      "Um universo de dança, descobertas e momentos inesquecíveis. Aqui, cada bailarina encontra espaço para aprender, crescer e brilhar.",
    cta: "Agende uma aula experimental",
    ctaNote: "Agendamento indisponível. Aguardamos o canal oficial da escola.",
    link: "Conheça nossas modalidades",
    signature: "Leveza em cada passo.",
    artLabel: "MOVIMENTO, EXPRESSÃO & ARTE",
  },
  ribbon: ["Ballet", "Expressão", "Movimento", "Descoberta"],
  modalities: {
    label: "O BALLET EM CADA FASE",
    title: "Um universo de possibilidades.",
    intro: "Descoberta, desenvolvimento, expressão e aprendizado em cada fase.",
    ageLabel: "Faixa etária",
    descriptionLabel: "Sobre a modalidade",
    pending: "A confirmar",
    pendingDescription: "Descrição pedagógica aguardando aprovação.",
    items: [
      {
        name: "Baby",
        tagline: "Primeiras descobertas",
        symbol: "◡",
        ageRange: null,
        description:
          "Consulte nossa equipe para conhecer a modalidade mais indicada.",
      },
      {
        name: "Pré-Ballet",
        tagline: "Novos movimentos",
        symbol: "◠",
        ageRange: null,
        description:
          "Consulte nossa equipe para conhecer a modalidade mais indicada.",
      },
      {
        name: "Infantil",
        tagline: "O encanto de aprender",
        symbol: "◇",
        ageRange: null,
        description:
          "Consulte nossa equipe para conhecer a modalidade mais indicada.",
      },
      {
        name: "Preparatório",
        tagline: "Próximos passos",
        symbol: "✧",
        ageRange: null,
        description:
          "Consulte nossa equipe para conhecer a modalidade mais indicada.",
      },
    ] as Modality[],
  },
  school: {
    label: "NOSSA ESCOLA",
    title: "Um lugar onde pequenos passos se transformam em grandes sonhos.",
    paragraphs: [
      "Na Joyce Helena — Escola de Ballet, acreditamos que a dança vai muito além de aprender movimentos e coreografias. Cada aula é uma oportunidade de descobrir talentos, desenvolver a confiança e viver momentos especiais.",
      "Nossa escola é um espaço de acolhimento, aprendizado e expressão, onde cada aluna é incentivada a explorar seu potencial, respeitando seu próprio ritmo e suas conquistas.",
      "Por meio do ballet, buscamos cultivar valores que acompanham nossas bailarinas dentro e fora da sala de aula: disciplina, dedicação, criatividade, amizade e amor pela arte.",
      "Das primeiras descobertas aos movimentos mais elaborados, cada etapa é acompanhada com carinho, atenção e sensibilidade.",
      "Aqui, cada bailarina tem seu tempo, cada conquista merece ser celebrada e cada sonho encontra espaço para florescer.",
    ],
    link: "Informações de contato",
    photo: {
      src: "/images/joyce-helena-nossa-escola.png",
      alt: "Fotografia oficial de uma aula na Escola Joyce Helena",
      caption: "Nossa escola · momentos de aprendizado",
      authorized: true,
    },
  },
  founder: {
    label: "NOSSA FUNDADORA",
    title: "Joyce Helena dos Santos",
    summary:
      "Desde a infância, Joyce Helena dos Santos carrega uma paixão especial pelo ballet. Um amor pela dança que se transformou no sonho de criar um espaço onde novas gerações pudessem descobrir a magia dessa arte.",
    expandLabel: "Conheça nossa fundadora",
    collapseLabel: "Recolher história da fundadora",
    story: [
      "Desde criança, Joyce Helena dos Santos carrega no coração uma paixão especial pelo ballet. Encantada pela delicadeza dos movimentos, pela beleza da música e pela magia dos palcos, encontrou na dança muito mais do que uma forma de expressão: encontrou uma inspiração para a vida.",
      "Natural de Bauru, interior de São Paulo, Joyce cresceu cultivando esse amor pela arte e, com o passar dos anos, viu nascer um sonho ainda maior: criar um espaço onde outras crianças também pudessem descobrir a magia do ballet.",
      "Foi desse sentimento que nasceu a Joyce Helena — Escola de Ballet, um lugar pensado para acolher sonhos, despertar talentos e proporcionar experiências que vão muito além da sala de aula.",
      "Para Joyce, cada aluna possui sua própria história, seu ritmo e seu brilho. Por isso, acredita em um ensino que une carinho, dedicação, disciplina e sensibilidade, respeitando cada fase do desenvolvimento.",
      "Mais do que ensinar passos e coreografias, sua missão é incentivar a autoconfiança, a criatividade e o amor pela dança, mostrando que cada pequena conquista merece ser celebrada.",
      "Hoje, à frente da escola que leva seu nome, Joyce transforma sua paixão de infância em inspiração para novas gerações de bailarinas.",
      "Porque todo grande sonho começa com um pequeno passo. E, na Escola Joyce Helena, cada passo é uma oportunidade de fazer a magia acontecer.",
    ],
    photo: {
      src: "/images/joyce-helena-fundadora.png",
      alt: "Fotografia oficial de Joyce Helena dos Santos, fundadora da escola",
      caption: "Joyce Helena dos Santos · fundadora",
      authorized: true,
    },
  },
  team: {
    label: "NOSSA EQUIPE",
    title: "Talento, dedicação e carinho em cada movimento.",
    members: schoolTeam,
    paragraphs: [
      "Por trás de cada aula, de cada conquista e de cada apresentação existe uma equipe que compartilha o mesmo propósito: transformar o amor pelo ballet em experiências especiais para nossas alunas.",
      "A Joyce Helena — Escola de Ballet conta com uma equipe formada por profissionais dedicadas, que unem atenção, sensibilidade e compromisso com o desenvolvimento de cada bailarina.",
      ...schoolTeam.map(({ name, role }) => `${name} — ${role}.`),
      "Porque ensinar ballet é muito mais do que ensinar a dançar. É inspirar sonhos, construir confiança e deixar marcas positivas em cada história.",
    ],
    expandLabel: "Saiba mais sobre nossa equipe",
    collapseLabel: "Recolher apresentação da equipe",
    photo: {
      src: "/images/joyce-helena-equipe.png",
      alt: "Registro institucional coletivo da Escola Joyce Helena",
      caption: "Escola Joyce Helena · registro institucional",
      authorized: true,
    },
  },
  photos: {
    pending: "Fotografia real aguardando autorização e disponibilização.",
    unavailable: "Fotografia indisponível no momento.",
  },
  performances: {
    label: "ESPETÁCULOS E APRESENTAÇÕES",
    title: "Quando o movimento encontra o palco.",
    intro:
      "Um espaço para guardar a expressão, o encontro e a beleza das apresentações. Os registros oficiais serão publicados após seleção e autorização.",
    galleryLabel: "Galeria de apresentações",
    note: "Registros de nossas apresentações. As memórias de 2024 e 2025 permanecem reunidas aqui.",
    photos: [
      {
        src: null,
        alt: "Registro autorizado de uma apresentação da escola",
        caption: "A dança em cena",
        authorized: false,
      },
      {
        src: null,
        alt: "Registro autorizado dos bastidores de uma apresentação",
        caption: "Entre bastidores e descobertas",
        authorized: false,
      },
      {
        src: null,
        alt: "Registro autorizado de momentos da escola no palco",
        caption: "Memórias para compartilhar",
        authorized: false,
      },
    ] as AuthorizedPhoto[],
  },
  joca: {
    label: "CONHEÇA A JÓCA",
    title: "Um toque de encanto por aqui.",
    eyebrow: "UM ROSTINHO PARA CONHECER",
    text: "Olá! Eu sou a Jóca, assistente virtual da Escola Joyce Helena! Estou chegando para ajudar você a conhecer nossa escola, descobrir o universo do ballet e acompanhar cada passo dessa linda jornada. Em breve estaremos ainda mais pertinho!",
    notice:
      "Atendimento virtual com respostas locais programadas. Sem inteligência artificial.",
    replay: "Assistir à apresentação da Jóca novamente",
    image: "/images/joca-personagem.jpg",
    profile: "/images/joca-perfil.png",
  },
  trial: {
    title: "Seu próximo grande passo começa aqui!",
    text: "Venha conhecer a Escola Joyce Helena e descobrir um universo de movimento, aprendizado, confiança e novas amizades.",
    cta: "Agende uma aula experimental!",
    note: "Converse com a escola para consultar horários e disponibilidade. O contato não confirma uma vaga.",
  },
  event: {
    title: "Quatro Estações — Espetáculo 2026",
    text: "Uma celebração da dança inspirada nas cores, nas transformações e na beleza das quatro estações do ano. Um espetáculo preparado para transformar movimentos em emoção e celebrar a trajetória das nossas bailarinas.",
    poster: "/images/espetaculo-quatro-estacoes-2026.png",
    note: "Data, horário, local e informações sobre ingressos aguardam divulgação oficial.",
  },
  contact: {
    label: "VAMOS NOS CONHECER?",
    title: "Uma conversa pode ser o primeiro passo.",
    intro: "Fale com a escola, conheça nossas modalidades e tire suas dúvidas.",
    whatsapp: {
      title: "WhatsApp",
      number: "(14) 99851-9343",
      url: whatsappUrl("5514998519343"),
    },
    alternative: {
      number: "(14) 99658-7217",
      url: whatsappUrl("5514996587217"),
    },
    instagram: {
      title: "Instagram",
      profile: "@balletjoycehelena",
      url: "https://www.instagram.com/balletjoycehelena/",
    },
    location: {
      title: "Local das aulas",
      name: "Associação dos Cabos e Soldados.",
      address: "Rua Alves Seabra, 4-30 — Vila Seabra, Bauru/SP.",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
          "Associação dos Cabos e Soldados, Rua Alves Seabra, 4-30, Vila Seabra, Bauru/SP",
        ),
    },
  },
  footer: {
    developerLabel: "Desenvolvido por",
    developerName: "MANDUCA TECH",
    signature: "A beleza está em cada passo.",
    back: "Voltar ao topo ↑",
  },
};
