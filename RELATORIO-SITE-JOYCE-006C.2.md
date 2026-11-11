# SITE-JOYCE-006C.2 — POC Cloudflare Workers AI

Desenvolvedor: **MANDUCA TECH**. Projeto: `site-joyce-helena`. Data: 11/11/2026.

**Preparação concluída; inferência real desativada.** Nenhum deploy, endpoint público, alteração de DNS, plano pago, cartão, Gemini API ou Ollama utilizado. O Worker remoto existente `joca-ai-teste` não foi modificado. Não houve acesso ou alteração no Worker `controle-viatura-api-proxy`.

## Estrutura implementada

Fluxo preparado: `JocaChat → ChatServiceFactory → CloudflareChatService → /api/joca/chat (Vite/Node local) → Worker Wrangler local → env.AI.run()`.

- `CloudflareChatService` reutiliza `ChatService`, mantém consentimento, histórico limitado em memória e fallback local. `LocalChatService` e `GeminiChatService` anteriores preservados.
- O frontend nunca recebe credenciais. O servidor faz ponte exclusivamente com `http://127.0.0.1:8787`, sem redirecionamentos. O segredo aleatório compartilhado entre processos é local, não é token da conta Cloudflare, e fica em arquivos ignorados pelo Git.
- O Worker fica em `workers/joca-ai-teste/`. `src/index.ts` contém `env.AI.run()` com o modelo exato solicitado. `src/mock.ts` executa respostas programadas, identificadas como **SIMULAÇÃO LOCAL, SEM IA**, sem binding AI.
- A interface e o CSS homologados foram preservados. Apenas os avisos opcionais de consentimento/status variam conforme provedor e modo. O atendimento local continua sendo o padrão.
- A base institucional é a lista pública já selecionada em `server/knowledge.ts`; não incorpora horários históricos, planilhas, dados de crianças ou documentos.

## Wrangler e isolamento

Wrangler **4.160.1**, versão consultada e fixada como dependência de desenvolvimento. Tipos gerados por `wrangler types`; compilação própria do Worker aprovada.

`workers/joca-ai-teste/wrangler.jsonc`:

```json
{
  "name": "joca-ai-teste",
  "main": "src/index.ts",
  "compatibility_date": "2026-11-11",
  "workers_dev": false,
  "preview_urls": false,
  "routes": [],
  "dev": { "ip": "127.0.0.1", "port": 8787, "local_protocol": "http" },
  "ai": { "binding": "AI", "remote": true }
}
```

O arquivo completo também desativa observabilidade e contém as três permissões de inferência como `false`. A configuração `wrangler.mock.jsonc` usa outro entrypoint e **não possui binding AI**. O código do Worker executa localmente; no modo remoto autorizado apenas o binding de inferência acessará a infraestrutura Cloudflare. Não usar `wrangler dev --remote` nem qualquer comando de publicação.

As opções locais `workers_dev:false` e `routes:[]` não alteram nem comprovam o estado do Worker já existente na conta. Nenhuma configuração remota foi aplicada.

## Segurança e limites

- Escuta confirmada somente em `127.0.0.1:8787`; origem do site fixa em `http://127.0.0.1:5174`; segredo exigido para inferência; sem CORS público.
- URLs externas e cabeçalhos de encaminhamento são recusados. Há verificação de modo: ponte simulada não é aceita por Worker real e vice-versa. A checagem de saúde local não gera inferência nem revela segredo.
- Entrada: até 500 caracteres; corpo de até 16.000 bytes; histórico de até seis mensagens com papéis validados. Sem ferramentas, imagens, streaming ou armazenamento de saída (`store:false`).
- Saída: até 256 tokens de conclusão e 2.000 caracteres. Respostas incompletas, vazias, excessivas, com formato inválido ou contendo o segredo local são rejeitadas.
- Worker: até três tentativas/minuto, dez tentativas por processo e uma inferência simultânea. A ponte também limita origem/global. Contadores locais reiniciam com o processo e não são controles distribuídos de produção.
- Timeout de inferência: oito segundos no Worker, dez na ponte e doze no cliente. O timeout não garante cancelamento ou ausência de consumo remoto; por isso o Worker mantém a trava de concorrência até a chamada terminar. Sem retries automáticos.
- Erros de segurança, cota, inferência e timeout não expõem mensagens técnicas. O chat oferece fallback local e WhatsApp. Nenhum conteúdo de conversa é registrado pelo código.
- A IA exige consentimento novo; o histórico local anterior não é enviado. Fechar o chat ou voltar ao atendimento local limpa o contexto autorizado.

## Testes e resultados

- `npm run lint`: aprovado.
- `npm run worker:types`: tipos gerados sem inferência.
- `npm run worker:check`: aprovado.
- `npm run build`: aprovado; 24 mídias verificadas por SHA-256 em `public/` e `dist/`.
- `npm test`: **65 testes aprovados**, mantendo os 58 anteriores.
- Após reforçar a verificação de modo, os sete testes Cloudflare foram executados novamente: **7/7 aprovados**, junto com lint, build e verificação de tipos.
- Cenários: português, resposta breve, horários/valores desconhecidos, tentativa de invenção, papéis injetados, ausência de consentimento/token, origem indevida, excesso de entrada/histórico, cota 429, erro de inferência, resposta inválida, timeout, concorrência, limites, fallback e proteção do bundle.
- Comunicação real entre ponte local e **Worker simulado no Wrangler** validada. O teste confirma o modo simulado antes de enviar a pergunta; não utiliza binding remoto.
- Os testes de interface anteriores revalidam tamanhos de tela, foco, teclado, scroll, vídeo e galerias. CSS, mídias e textos institucionais não mudaram; 29 arquivos do inventário DANZIA continuam idênticos.
- Ajuste encontrado durante a validação: o runtime Wrangler injeta `CF-Connecting-IP` mesmo localmente. A rejeição indiscriminada desse cabeçalho foi retirada; permanecem endereço loopback, origem, segredo e modo obrigatório. Nenhuma mensagem pessoal foi usada no diagnóstico.
- A instalação manteve dez avisos moderados na cadeia de ferramentas de desenvolvimento já existente; nenhuma atualização com quebra de versão foi aplicada fora do escopo.

As respostas do modelo real em português, sua factualidade e resistência a indução **não estão homologadas**: os testes usam respostas simuladas. Dispositivos físicos também não foram testados nesta etapa.

## Como testar localmente sem consumir cota

Na pasta `site-joyce-helena`, execute:

```powershell
npm run worker:mock
```

Esse comando prepara o segredo local sem exibi-lo nem sobrescrever uma configuração existente e inicia o entrypoint simulado. Em outro terminal, inicie o site com configuração temporária:

```powershell
$env:JOCA_PROVIDER = "cloudflare"
$env:JOCA_CF_MODE = "mock"
npm run dev
```

Abra `http://127.0.0.1:5174`. No chat, clique **Iniciar simulação local** e faça perguntas institucionais fictícias. Não enviar dados de crianças. A interface identifica explicitamente a simulação. Se a porta 5174 já estiver ocupada pela sessão anterior do site, encerre essa sessão antes de iniciar a nova.

Depois de encerrar o site, remova as duas variáveis temporárias desse terminal para voltar ao atendimento local:

```powershell
Remove-Item Env:JOCA_PROVIDER
Remove-Item Env:JOCA_CF_MODE
```

O comando `npm test` inicia/reutiliza exclusivamente o servidor Worker simulado. O teste de integração recusa um servidor que se identifique como real. Não há comando de deploy nos scripts do projeto.

## Conta, modelo, licença e privacidade

O modelo `@cf/google/gemma-4-26b-a4b-it` consta do [catálogo oficial](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/), com a interface `env.AI.run()`. A licença vinculada pelo catálogo é [Apache 2.0](https://ai.google.dev/gemma/docs/gemma_4_license). Não foram baixados ou redistribuídos pesos. Registro: `workers/joca-ai-teste/MODEL-NOTICE.md`.

A documentação confirma [bindings remotos com código local](https://developers.cloudflare.com/workers/local-development/bindings-per-env/). A [cota gratuita publicada](https://developers.cloudflare.com/workers-ai/platform/pricing/) é compartilhada pela conta; a inferência remota a consome mesmo com código local. Não confundir limites desta POC com saldo disponível da conta.

Foi executada somente a consulta de autenticação `wrangler whoami`, sem iniciar login: **não há sessão autenticada disponível neste ambiente**. Portanto, disponibilidade do modelo na conta, plano vigente e consumo/saldo ainda **não verificados**. Nenhuma conclusão sobre saldo foi presumida e nenhuma inferência foi feita.

A [política de dados Workers AI](https://developers.cloudflare.com/workers-ai/platform/data-usage/) informa não utilização do conteúdo para treinamento e processamento com retenção limitada, sujeito a exceções e metadados operacionais. Confirmar os termos aplicáveis, finalidade e aviso de privacidade antes de enviar mensagens a esse serviço externo. A licença Apache do modelo não equivale à aprovação de privacidade do site.

## Condições para a primeira inferência real

1. Receber autorização explícita da Central de Comando para uma pergunta institucional fictícia.
2. Autenticar localmente o Wrangler na conta correta, sem compartilhar tokens em chat ou frontend; confirmar que a conta é a que contém `joca-ai-teste`.
3. Conferir o catálogo disponível nessa conta e o consumo Workers AI imediatamente antes do teste, incluindo outros projetos. Confirmar plano gratuito, saldo suficiente e ausência de necessidade de contratação; não ativar planos pagos.
4. Revisar licença/privacidade e os termos do serviço. Registrar a revisão e o cenário permitido, sem documentos pessoais.
5. Somente então habilitar as permissões locais correspondentes no site e em `.dev.vars`. O Worker exige `ALLOW_REAL_INFERENCE`, `LICENSE_PRIVACY_REVIEWED` e `ACCOUNT_QUOTA_VERIFIED`; o site exige `JOCA_CF_MODE=remote`, `JOCA_CF_REAL_AUTHORIZED`, `JOCA_CF_PRIVACY_REVIEWED` e `JOCA_CF_QUOTA_VERIFIED`.
6. Encerrar o mock e iniciar **Wrangler dev local com a configuração principal**, sem `--remote`, usando o binding remoto. Não publicar código. Obter consentimento na interface, realizar apenas o cenário autorizado e conferir o consumo após a resposta. Reverter permissões ao terminar.

Todos esses indicadores de autorização real permanecem desativados. Não houve login automático nem solicitação de cartão.

## Arquivos criados e modificados

Criados:
- `workers/joca-ai-teste/wrangler.jsonc`, `wrangler.mock.jsonc`, `tsconfig.json`, `worker-configuration.d.ts`, `.dev.vars.example`, `MODEL-NOTICE.md`.
- `workers/joca-ai-teste/src/handler.ts`, `src/index.ts`, `src/mock.ts`.
- `src/joca/cloudflare-chat-service.ts`, `server/cloudflare-bridge.ts`, `scripts/prepare-cloudflare-local.mjs`, `tests/joca-cloudflare.spec.ts`, este relatório.

Modificados:
- `src/joca/chat-service-factory.ts`, `src/joca/JocaChat.tsx`.
- `server/chat-endpoint.ts`, `server/vite-plugin.ts`, `vite.config.ts`.
- `package.json`, `package-lock.json`, `playwright.config.ts`, `eslint.config.js`, `.gitignore`, `.env.example`, `README.md`.

Arquivos locais ignorados: `.local/cloudflare/bridge-token`, `workers/joca-ai-teste/.dev.vars`, estado temporário `.wrangler/`, inventários `.local/site006c2-account-check.json` e `.local/site006c2-preservation.json`. Não incluir esses arquivos em publicação.

Encerrado após a preparação. **Aguardando autorização para a primeira inferência real.**
