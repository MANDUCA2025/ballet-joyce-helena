# SITE-JOYCE-006C.1 — Preparação segura do Gemini

Data: 11/11/2026. Integração preparada; **IA real desativada**. Nenhuma chamada real ao Gemini, ativação de faturamento, publicação ou alteração de DNS.

## Arquitetura entregue

- `LocalChatService` preserva as respostas e o contrato `ChatService` existentes.
- `GeminiChatService` usa somente o endpoint de mesma origem `/api/joca/chat`; nunca acessa Google diretamente. `ChatServiceFactory` seleciona o modo local ou Gemini após configuração e consentimento.
- `server/vite-plugin.ts` instala o endpoint Node.js/TypeScript no servidor de desenvolvimento existente, em `127.0.0.1:5174`. `npm run dev` continua suficiente. Não foi instalado framework de backend.
- `/api/joca/config` informa apenas disponibilidade booleana, sem modelo, chave ou configuração sensível. O endpoint não integra o build estático nem o servidor de preview. Um futuro ambiente publicado precisará de servidor próprio e revisão de segurança; nada disso foi implantado.
- SDK oficial `@google/genai` **3.1.0**, versão consultada no npm antes da instalação e fixada no lockfile. Uso da Gemini Developer API, sem Vertex AI, ferramentas, pesquisa, uploads, cache persistente ou retries automáticos.

## Segurança, limites e base pública

Chave somente em `GEMINI_API_KEY` no servidor. `.env` e `.env.*` ignorados pelo Git, exceto `.env.example`; arquivos do servidor e ambientes bloqueados no servidor de arquivos Vite. SDK, chave e instruções de sistema ausentes do bundle de produção.

Validação de JSON, propriedades permitidas, papéis alternados e consentimento versionado; mensagem de até 500 caracteres, histórico de até seis mensagens (três pares), resposta de até 2.000 caracteres. Corpo de até 16.000 bytes; leitura em até cinco segundos. Geração limitada a 512 tokens, timeout de dez segundos no servidor e doze segundos no cliente. Respostas vazias, excessivas, interrompidas ou contendo a chave são rejeitadas.

Origem e Host exatos, sem CORS aberto. Padrão `http://127.0.0.1:5174`; alternativa local `http://localhost:5174` exige configuração correspondente. Limites em memória: seis tentativas/minuto por origem, vinte globais/minuto, cem por janela global de 24 horas e duas gerações simultâneas. Não confiamos em `X-Forwarded-For`. Todos os visitantes da mesma origem compartilham o limite conservador. Os contadores reiniciam com o processo e não substituem proteção distribuída de produção.

A base em `server/knowledge.ts` seleciona explicitamente informações já públicas: modalidades, descrições e idades com pendência e sobreposição aos dez anos; aula experimental sem confirmação automática; endereço; contatos; Instagram; fundadora; Quatro Estações 2026. Não importa horários editoriais, planilhas, documentos ou cadastros. O prompt trata a conversa como dados não confiáveis e orienta encaminhamento ao WhatsApp quando faltam fatos. A aderência de respostas de um modelo real ainda precisa de avaliação; instruções de sistema não são garantia absoluta contra invenções.

Nenhuma conversa ou erro bruto do SDK é gravado ou registrado pelo servidor. O histórico temporário autorizado permanece apenas em memória do navegador e é limitado antes do envio. Erros de chave/cota/429/timeout/indisponibilidade/resposta inválida produzem fallback local e mantêm WhatsApp acessível, sem mostrar detalhes técnicos.

## Consentimento e pendência de elegibilidade

O atendimento local continua padrão. Quando a configuração do servidor permitir, aparece aviso explicando envio ao Google, utilização de dados no nível gratuito e possível revisão humana. Somente o botão **Autorizar envio das próximas mensagens à IA** habilita o envio. Rascunho anterior é limpo; o histórico local anterior nunca é encaminhado. Fechar o painel ou voltar ao atendimento local revoga a autorização e limpa o contexto da IA. WhatsApp não depende da IA.

**Pendência impeditiva para ativação:** os termos atuais do Gemini restringem clientes dirigidos a, ou provavelmente acessados por, menores de 18 anos. Como o site é de uma escola infantil, a compatibilidade deve ser resolvida antes da primeira chamada real. Um clique de consentimento ou simples confirmação de idade não resolve, por si só, essa restrição. O servidor exige `JOCA_ELIGIBILITY_REVIEWED=true`, desativado no exemplo; esse campo registra uma revisão, não concede elegibilidade. Também devem ser avaliadas as restrições regionais e condições de processamento do nível gratuito. Não houve declaração de aprovação jurídica ou homologação real.

## Modelo proposto

`gemini-3.1-flash-lite`, configurável por `GEMINI_MODEL`. A documentação consultada o classifica como estável, voltado a tarefas leves e baixa latência, e lista entrada/saída gratuitas no nível Free. É adequado para respostas curtas sobre uma base institucional pequena. A disponibilidade e a cota **no projeto específico da escola não foram verificadas**, pois não houve uso de credenciais ou chamadas reais.

Fontes oficiais consultadas:
- [SDK Google Gen AI](https://github.com/googleapis/js-genai)
- [Modelo Gemini 3.1 Flash-Lite](https://aistudio.google.com/docs/models/gemini-3.1-flash-lite)
- [Preços e nível gratuito](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite)
- [Termos: idade, regiões e uso de dados](https://aistudio.google.com/docs/terms)

## Configurar com segurança, após resolver as pendências

1. Na pasta do projeto, copie `.env.example` para `.env.local` **somente se o arquivo de destino não existir**; caso exista, edite-o localmente preservando seus valores.
2. Insira a chave em `GEMINI_API_KEY` usando editor local. Nunca use prefixo `VITE_`, nunca cole a chave em código, chat, capturas ou relatórios e nunca coloque arquivos de ambiente em `public/`.
3. Mantenha `JOCA_AI_ENABLED=false`, `JOCA_ELIGIBILITY_REVIEWED=false` e `JOCA_FREE_TIER_CONFIRMED=false` até aprovação. Nenhum arquivo com chave foi criado nesta entrega.
4. Após resolver elegibilidade/privacidade, verificar no AI Studio que o projeto está no nível Free, sem faturamento habilitado, e confirmar modelo/cota. As flags não consultam nem garantem a situação da conta; não evitam cobranças caso alguém posteriormente habilite faturamento no Google.
5. Somente com aprovação da Central de Comando, ajustar as três flags para `true`, reiniciar `npm run dev`, abrir `http://127.0.0.1:5174` e autorizar explicitamente o envio na interface. A primeira chamada deve usar pergunta institucional sem dados pessoais.

Sem ativação ou com chave ausente, a interface permanece local. A primeira chamada real e sua avaliação **não foram realizadas**.

## Verificações

- `npm run lint`: aprovado.
- `npm run build`: aprovado; 24 mídias verificadas por SHA-256 no diretório público e no build.
- `npm test`: **58 testes aprovados** (40 cenários anteriores preservados + 18 novos).
- `npx playwright test --config playwright.chrome.config.ts`: **13 testes complementares aprovados**.
- Novos cenários: respostas rápidas/lentas simuladas; histórico limitado; validação, origens/Host/métodos; consentimento; chave ausente; 429/timeout/indisponibilidade; resposta inválida; limites por origem/globais/concorrência; fallback; revogação; ausência de histórico local no envio; proteção de segredos e texto sem HTML executável.
- Responsividade anterior revalidada em 320, 375, 390, 768, 1024 e 1440 px, horizontal, altura reduzida, teclado simulado e zoom. Consentimento adicional verificado em cinco larguras. Testes em aparelho físico continuam pendentes.
- Conferência de preservação: CSS do chat, conteúdo, avatar, vídeo, fotos, galerias e testes anteriores sem alteração; 29 arquivos do DANZIA coincidem com o inventário de hashes existente.
- Durante a validação foram corrigidos tipos TypeScript nos testes e a simulação de `Host`: o `fetch` do Node normalizava o cabeçalho; o teste usa agora HTTP nativo para exercer a rejeição real. Não houve necessidade de alterar cenários anteriores.
- `npm audit` reportou dez alertas moderados na cadeia de desenvolvimento ESLint/typescript-eslint/minimatch. Nenhum alerta listado pertence ao SDK Gemini instalado. Não foram aplicadas migrações de ferramentas ou correções com quebra de versão fora do escopo.

## Arquivos

Criados:
- `server/chat-endpoint.ts`, `server/provider.ts`, `server/knowledge.ts`, `server/vite-plugin.ts`.
- `src/joca/gemini-chat-service.ts`, `src/joca/chat-service-factory.ts`.
- `tests/joca-api.spec.ts`, `tests/joca-gemini.spec.ts`.
- `.env.example` e este relatório.

Modificados:
- `src/joca/chat-service.ts`, `src/joca/JocaChat.tsx`.
- `vite.config.ts`, `.gitignore`, `package.json`, `package-lock.json`, `README.md`.

Artefatos locais: build em `dist/`, evidência de preservação em `.local/site006c1-preservation.json`, auditoria em `.local/site006c1-audit.json` e capturas abaixo. Capturas do consentimento usam disponibilidade **simulada**, sem ativar IA real:
- [Desktop — consentimento](.local/site006c1-consent-1440.png)
- [Mobile — consentimento](.local/site006c1-consent-375.png)

Entrega encerrada no SITE-JOYCE-006C.1, aguardando inspeção da Central de Comando.
