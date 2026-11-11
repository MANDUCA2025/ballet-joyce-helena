# Joyce Helena — Escola de Ballet

Homepage independente em React, TypeScript e Vite. Sem backend, banco ou autenticação. Nada publicado.

## Execução local
Na pasta do projeto, execute `npm run dev` e abra http://127.0.0.1:5174/.
Requisitos: Node.js 24.13+, npm e dependências instaladas (`npm ci` em um novo checkout).
Há um único modo de desenvolvimento, com todas as fotografias autorizadas.

## Validação
Execute, nessa ordem:
```powershell
npm run lint
npm run build
npm test
```
Os testes usam Microsoft Edge, o servidor de desenvolvimento em 5174 e uma prévia temporária do build em 4174. Para inspecionar o build manualmente: `npm run preview`.
Capturas da versão unificada: `.local/site005b-homepage-desktop.png` e `.local/site005b-homepage-mobile.png`.

## Imagens e autorização editorial
O diretório oficial é `public/images`:
- `escola/`: seis fotografias de aulas.
- `espetaculos/2024/`: três fotografias.
- `espetaculos/2025/`: cinco fotografias.
- Raiz: fotos institucionais, logo, Joca e cartaz Quatro Estações.

As 17 fotografias foram autorizadas expressamente pela direção no SITE-JOYCE-005B para inclusão nos arquivos públicos e futura divulgação na internet. O Hero reutiliza aula-acolhimento.png.
Os nomes finais não têm extensões duplicadas. Originais preservados como arquivo histórico local; nenhuma parte da aplicação, build ou testes depende desse arquivo histórico.

`src/media-authorization.json` registra autorização editorial e SHA-256 de cada mídia pública, sem documentos pessoais.
`src/gallery-content.ts` contém caminhos, legendas, dimensões e autorização das galerias.
`src/content.ts` contém textos e fotografias institucionais.
Novas imagens devem iniciar com `authorized: false` e permanecer FORA de public até autorização expressa. Após aprovação, registrar caminho/hash no manifesto e atualizar o conteúdo correspondente. O build rejeita arquivos desconhecidos, não autorizados, alterados ou com extensão duplicada antes de gerar dist e confere novamente o resultado. Não colocar documentos ou arquivos administrativos em public.

## Conteúdo e preservação
A abertura original da Joca, seus controles, vídeo, sessão e testes permanecem preservados. As galerias mantêm lightbox, teclado, Escape e retorno do foco. Não há IA ativa ou agendamento automático.
WhatsApp, Instagram e localização usam os dados oficiais fornecidos no SITE-JOYCE-005.
Ainda pendem confirmação final das faixas etárias, reconciliação do material anterior de 4 a 17 anos, horários e informações adicionais do espetáculo.
Publicar ou alterar DNS exige outra autorização; esta entrega não realiza nenhuma dessas ações.
Detalhes da unificação: [relatório SITE-JOYCE-005B](RELATORIO-SITE-JOYCE-005B.md).

## SITE-JOYCE-005C
Hero atualizado e cabeçalho com logo 88/60 px. Horários de novembro de 2026 em src/content.ts, conforme transcrição fornecida; conferência direta da planilha pendente de localização. Veja [relatório e capturas](RELATORIO-SITE-JOYCE-005C.md).

## SITE-JOYCE-005E — estado atual
Horários saíram do conteúdo público. A fonte histórica e pendências estão em editorial/, sem importação pelo frontend e bloqueadas no servidor local. Os cartões usam src/schedule-contact.ts para WhatsApp; Joca permanece desabilitada. Veja [relatório](RELATORIO-SITE-JOYCE-005E.md).

## SITE-JOYCE-006A — Joca
Chat local disponível no avatar e nos botões Consultar horários. Respostas programadas sem IA, somente estado em memória. Base em src/joca/knowledge.ts, serviço substituível em chat-service.ts e interface em JocaChat.tsx. Nenhuma chave, backend ou persistência de conversa.
Configuração atual de src/schedule-contact.ts usa joca; WhatsApp permanece como encaminhamento. A abertura original em vídeo está preservada.
Capturas e validações: [relatório](RELATORIO-SITE-JOYCE-006A.md). Não publicado.

## SITE-JOYCE-006B
Refino mobile da Jóca: launcher compacto, painel inferior adaptativo e leitura mais confortável, com respostas locais preservadas. Veja [relatório e validações](RELATORIO-SITE-JOYCE-006B.md). Sem publicação ou integração de IA.

## SITE-JOYCE-006B.1
Revisão de scroll, foco, fundo, retry e viewport da Jóca. Validação Edge e Chrome; homologação física pendente. [Relatório e evidências](RELATORIO-SITE-JOYCE-006B.1.md). Para a rodada complementar: npx playwright test --config=playwright.chrome.config.ts.

## SITE-JOYCE-006C.1 — preparação do Gemini (desativado)

O estado atual mantém respostas locais por padrão. Há endpoint Node/TypeScript de desenvolvimento em `/api/joca/chat`, integrado ao `npm run dev` na porta 5174. O build/preview continua estático, sem endpoint de IA.

Configuração de exemplo em `.env.example`; segredos somente em `.env.local`, ignorado pelo Git. Nunca usar `VITE_GEMINI_API_KEY`. Não ativar antes de resolver a elegibilidade do público nos termos do Gemini e confirmar o nível Free do projeto. Nenhuma chamada real ou publicação foi feita.

Arquitetura, configuração segura, modelo, testes, capturas e pendências: [relatório SITE-JOYCE-006C.1](RELATORIO-SITE-JOYCE-006C.1.md).

## SITE-JOYCE-006C.2 — POC Cloudflare (inferência real desativada)

Worker isolado em `workers/joca-ai-teste/`. `npm run worker:mock` executa respostas simuladas localmente, sem binding AI e sem consumo de cota. `npm run worker:types` gera os tipos; `npm run worker:check` verifica a compilação. `npm test` inicia o mock automaticamente.

O site continua local por padrão. Para a revisão simulada no navegador, consulte os comandos e a configuração temporária no [relatório SITE-JOYCE-006C.2](RELATORIO-SITE-JOYCE-006C.2.md). O binding remoto está preparado, mas não foi iniciado. Sem deploy, Gemini API ou Ollama nesta etapa. Conta/cota ainda pendentes de autenticação e verificação; nenhuma chamada real está autorizada.
