// Base editorial local: encaminhamentos não representam regras confirmadas.
export const intents = [
  {
    id: "greeting",
    label: "Boas-vindas",
    examples: ["Oi", "Olá Jóca", "Bom dia", "Boa noite"],
    pattern: "^(oi|ola( joca)?|bom dia|boa tarde|boa noite|obrigad[oa])$",
    answer:
      "Que bom conversar com você! Sou a Jóca, assistente virtual de atendimento automático. Posso ajudar com modalidades, endereço e contatos.",
  },
  {
    id: "school",
    label: "Nossa escola",
    examples: [
      "Quero conhecer a escola",
      "Fale sobre a escola",
      "Como é a escola",
      "Apresente a escola",
    ],
    pattern:
      "conhecer a escola|sobre a escola|como e a escola|apresente a escola",
    answer:
      "Conheça a Joyce Helena — Escola de Ballet! No site você encontra nossas modalidades, fotografias de aulas e memórias de apresentações.",
  },
  {
    id: "modalities",
    label: "Modalidades",
    examples: [
      "Quais modalidades existem",
      "Conhecer modalidades",
      "Quais cursos oferecem",
      "Quais turmas existem",
    ],
    pattern: "\\bmodalidades\\b|\\bcursos\\b|quais turmas",
    answer: "",
  },
  {
    id: "differences",
    label: "Diferenças",
    examples: [
      "Qual a diferença entre modalidades",
      "Diferença entre Baby e Infantil",
      "Como as modalidades se diferenciam",
      "O que muda de uma turma para outra",
    ],
    pattern: "diferenca|diferenciam|o que muda",
    answer:
      "A escola oferece Baby, Pré-Ballet, Infantil e Preparatório. Não tenho uma comparação pedagógica homologada; a equipe pode explicar as propostas pelo WhatsApp.",
  },
  {
    id: "choice",
    label: "Escolha de modalidade",
    examples: [
      "Qual modalidade escolher",
      "Qual turma escolher",
      "Qual ballet é indicado",
      "Qual modalidade é melhor",
    ],
    pattern: "qual (modalidade|turma|ballet).*(escolher|indicado|melhor)",
    answer:
      "Consulte nossa equipe pelo WhatsApp para conhecer a modalidade mais indicada. Não definimos turmas por idade neste atendimento.",
  },
  {
    id: "age",
    label: "Idade",
    examples: [
      "Qual a idade mínima",
      "Tem limite de idade",
      "Minha filha tem 3 anos",
      "Qual turma para 10 anos",
    ],
    pattern: "\\bidade\\b|\\b\\d{1,2} anos?\\b",
    answer:
      "Consulte nossa equipe pelo WhatsApp para conhecer a modalidade mais indicada. Não definimos turmas por idade neste atendimento.",
  },
  {
    id: "beginner",
    label: "Iniciantes",
    examples: [
      "Nunca fez ballet",
      "Aceitam iniciantes",
      "Precisa saber dançar",
      "Pode começar do zero",
    ],
    pattern: "iniciante|nunca fez|saber dancar|comecar do zero",
    answer:
      "Que bom querer começar! Consulte a equipe para conhecer as opções para iniciantes. Não posso confirmar requisitos ou disponibilidade de turma.",
  },
  {
    id: "trial",
    label: "Aula experimental",
    examples: [
      "Quero aula experimental",
      "Posso fazer aula teste",
      "Como agendar uma experiência",
      "Quero experimentar uma aula",
    ],
    pattern: "experimental|aula teste|agendar|agendamento|experimentar",
    answer:
      "Você pode solicitar informações e agendamento de uma aula experimental pelo WhatsApp da escola. A equipe confirma os horários e a disponibilidade; esta conversa não realiza matrícula nem garante vaga.",
  },
  {
    id: "enrollment",
    label: "Matrícula",
    examples: [
      "Quero matricular minha filha",
      "Como fazer matrícula",
      "Como me inscrever",
      "Quero inscrição",
    ],
    pattern: "matricul|inscri",
    answer:
      "Que alegria! Para solicitar matrícula, converse com a equipe pelo WhatsApp. Ela orientará as próximas etapas; esta conversa não realiza matrícula nem garante vaga.",
  },
  {
    id: "documents",
    label: "Documentação",
    examples: [
      "Quais documentos para matrícula",
      "Precisa de documentação",
      "O que levar para inscrição",
      "Quais papéis para matrícula",
    ],
    pattern: "documentacao|documentos para|papeis para|levar para inscricao",
    answer:
      "A lista de documentos de matrícula precisa ser confirmada pela equipe. Consulte o WhatsApp; não envie documentos ou dados pessoais de crianças aqui.",
  },
  {
    id: "prices",
    label: "Valores",
    examples: [
      "Quanto custa o ballet",
      "Qual o valor",
      "Tem mensalidade",
      "Quanto pago por mês",
    ],
    pattern: "quanto custa|\\bvalor(es)?\\b|mensalidade|quanto pago|preco",
    answer:
      "Ainda não tenho essa informação confirmada sobre valores ou mensalidades. A equipe poderá orientar pelo WhatsApp, sem cobrança ou contratação por este chat.",
  },
  {
    id: "payment",
    label: "Pagamento",
    examples: [
      "Quais formas de pagamento",
      "Aceita pix",
      "Posso pagar com cartão",
      "Tem boleto",
    ],
    pattern: "pagamento|\\bpix\\b|cartao|boleto",
    answer:
      "As formas de pagamento devem ser confirmadas com a equipe pelo WhatsApp. Não recebo pagamentos nem forneço dados bancários neste atendimento.",
  },
  {
    id: "billing",
    label: "Vencimentos",
    examples: [
      "Qual o vencimento",
      "Quando vence a mensalidade",
      "Tenho uma cobrança",
      "Meu pagamento está atrasado",
    ],
    pattern: "vencimento|vence|cobranca|atrasado",
    answer:
      "Para vencimentos ou cobranças, procure a equipe pelo WhatsApp. Não consulto situação financeira, saldos ou pagamentos e não preciso desses dados aqui.",
  },
  {
    id: "schedule",
    label: "Horários",
    examples: [
      "Quais horários das aulas",
      "Como consultar horários",
      "Quais dias de aula",
      "Que horas começa",
    ],
    pattern: "horarios?|dias? de aula|que horas|quando.*aula",
    answer: "",
  },
  {
    id: "vacancies",
    label: "Vagas",
    examples: [
      "Tem vaga",
      "Há disponibilidade de vagas",
      "A turma está cheia",
      "Posso reservar uma vaga",
    ],
    pattern: "\\bvagas?\\b|turma esta cheia",
    answer:
      "A disponibilidade de vagas precisa ser consultada com a equipe pelo WhatsApp. Não confirmo nem reservo vagas neste atendimento.",
  },
  {
    id: "location",
    label: "Localização",
    examples: [
      "Onde fica a escola",
      "Qual o endereço",
      "Localização",
      "Onde são as aulas",
    ],
    pattern: "onde fica (a )?escola|endereco|localizacao|onde sao as aulas",
    answer: "",
  },
  {
    id: "directions",
    label: "Como chegar",
    examples: [
      "Como chegar",
      "Pode mandar o mapa",
      "Tem link do mapa",
      "Como encontro o local",
    ],
    pattern: "como chegar|\\bmapa\\b|encontro o local",
    answer: "",
  },
  {
    id: "contacts",
    label: "Contatos",
    examples: [
      "Quais contatos",
      "Qual o telefone",
      "Como entrar em contato",
      "Falar com a escola",
    ],
    pattern: "contatos?|telefone|falar com a escola",
    answer: "",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    examples: [
      "Falar pelo WhatsApp",
      "Qual o WhatsApp",
      "Me passa o zap",
      "Quero o contato no whats",
    ],
    pattern: "whatsapp|\\bzap\\b|\\bwhats\\b",
    answer: "",
  },
  {
    id: "instagram",
    label: "Instagram",
    examples: [
      "Qual o Instagram",
      "Tem insta",
      "Qual a rede social",
      "Quero seguir a escola",
    ],
    pattern: "instagram|\\binsta\\b|rede social|seguir a escola",
    answer: "",
  },
  {
    id: "team",
    label: "Equipe",
    examples: [
      "Quem são as professoras",
      "Como é a equipe",
      "Quem cuida da administração",
      "Quem é Natália",
    ],
    pattern: "professor|equipe|administracao|natalia|ester|\\bmary\\b|auxiliar",
    answer:
      "",
  },
  {
    id: "founder",
    label: "Fundadora",
    examples: [
      "Quem é Joyce",
      "Quem fundou a escola",
      "Quem é a fundadora",
      "Conte sobre Joyce Helena",
    ],
    pattern: "fundadora|quem.*joyce|quem.*fundou|sobre joyce",
    answer: "",
  },
  {
    id: "uniform",
    label: "Uniforme",
    examples: [
      "Precisa de uniforme",
      "Qual roupa usar",
      "Como comprar o uniforme",
      "Pode usar qualquer roupa",
    ],
    pattern: "uniforme|roupa",
    answer:
      "A orientação sobre uniforme ou roupa para as aulas deve ser confirmada com a equipe. Consulte o WhatsApp antes de comprar; não tenho uma lista oficial de peças.",
  },
  {
    id: "materials",
    label: "Materiais",
    examples: [
      "Quais materiais levar",
      "Precisa de sapatilha",
      "O que levar para aula",
      "Precisa de acessórios",
    ],
    pattern: "materiais|sapatilha|levar para aula|acessorios",
    answer:
      "Os materiais e acessórios necessários dependem da orientação da escola. Confirme com a equipe antes de comprar; não tenho uma lista oficial para indicar.",
  },
  {
    id: "shows",
    label: "Espetáculos",
    examples: [
      "Quais são os espetáculos",
      "Fale das apresentações",
      "Quatro Estações 2026",
      "Tem espetáculo",
    ],
    pattern: "espetaculo|apresentac|quatro estac",
    answer: "",
  },
  {
    id: "costumes",
    label: "Figurinos",
    examples: [
      "Como funciona o figurino",
      "Onde comprar figurino",
      "Quem faz os figurinos",
      "Qual traje da apresentação",
    ],
    pattern: "figurino|traje da apresentacao",
    answer:
      "Para figurinos de apresentações, consulte a equipe. Não tenho informações confirmadas sobre modelos, fornecedores, custos ou prazos.",
  },
  {
    id: "rehearsals",
    label: "Ensaios",
    examples: [
      "Quando são os ensaios",
      "Qual o ensaio",
      "Onde será o ensaio",
      "Precisa participar do ensaio",
    ],
    pattern: "ensaio",
    answer:
      "Datas, locais e orientações de ensaios devem ser confirmados com a equipe. Não tenho uma programação homologada para informar.",
  },
  {
    id: "tickets",
    label: "Ingressos",
    examples: [
      "Quanto custa o ingresso",
      "Onde comprar ingresso",
      "Quando vendem ingressos",
      "Tem ingresso disponível",
    ],
    pattern: "ingresso",
    answer:
      "Quatro Estações — Espetáculo 2026: data, horário, local e informações sobre ingressos aguardam divulgação oficial. Consulte a equipe; não vendo nem reservo ingressos.",
  },
  {
    id: "absence",
    label: "Faltas e reposições",
    examples: [
      "Posso repor uma aula",
      "Como avisar uma falta",
      "Tem reposição",
      "O que acontece se faltar",
    ],
    pattern: "reposicao|repor|falta(r)?\\b",
    answer:
      "Para comunicar uma falta ou perguntar sobre reposição, fale com a equipe pelo WhatsApp. Não tenho regras confirmadas de reposição ou cancelamento e não autorizo compensações.",
  },
  {
    id: "human",
    label: "Atendimento humano",
    examples: [
      "Quero falar com uma pessoa",
      "Preciso de atendimento humano",
      "Quero uma atendente",
      "Falar com alguém de verdade",
    ],
    pattern: "pessoa|humano|atendente|alguem de verdade",
    answer:
      "Claro! Você pode conversar diretamente com a equipe no WhatsApp principal pelo link abaixo. O envio depende de você; não encaminho mensagens automaticamente.",
  },
] as const;
export type IntentId = (typeof intents)[number]["id"];
export const initialQuestions = [
  "Conhecer modalidades",
  "Aula experimental",
  "Consultar horários",
  "Como fazer matrícula",
  "Localização",
  "Falar pelo WhatsApp",
];
