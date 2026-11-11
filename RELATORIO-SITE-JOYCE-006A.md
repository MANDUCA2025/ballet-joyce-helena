# SITE-JOYCE-006A — Joca local

Acesso: http://127.0.0.1:5174/ — npm run dev.
Chat virtual de perguntas frequentes, com respostas determinísticas locais explicitamente identificadas. Não usa IA, backend, API remota ou serviço contratado.

## Implementação
- Avatar oficial fixo, 60 px desktop / 52 px mobile, texto “Fale com a Joca”, identidade rosa/verde/marfim, margem de área segura.
- Avatar encontrado como joca-avatar.png.png. Cópia padronizada em public/images/joca-avatar.png; original preservado em .local/originals e integridade SHA-256 registrada no manifesto (24 mídias).
- Painel desktop de 380 px e mobile adaptado ao viewport, inclusive altura reduzida e eventos de visualViewport. Histórico com rolagem própria, campo de até 500 caracteres, enviar/fechar, estado de processamento real, Escape e retorno do foco.
- Respostas sobre modalidades, idade, endereço, horários (somente encaminhamento), aula experimental, contatos, Instagram, fundadora e espetáculo. Dez anos reconhece sobreposição; faixas sempre sujeitas à confirmação. Perguntas desconhecidas direcionam à equipe. Nenhuma confirmação de matrícula ou vaga.
- Quatro botões Consultar horários abrem o painel com a modalidade. Encaminhamento mantém WhatsApp principal/alternativo e não envia o histórico automaticamente.
- Estado temporário em memória, sem localStorage, cookies, banco ou gravação de conversas. Ao recarregar, histórico reinicia; histórico limitado às últimas mensagens. Não solicita dados pessoais de crianças/documentos.
- Mensagens renderizadas como texto React. Sem HTML fornecido pelo usuário, segredos ou chamadas a provedores de IA.
- knowledge.ts reúne informações oficiais; chat-service.ts define o contrato ChatService e respostas locais; JocaChat.tsx contém a interface. Futuro serviço pode substituir a implementação, sem refazer a UI. Integração de IA real não iniciada.
- Aviso estático antigo de “não há chat” atualizado para refletir o atendimento programado; vídeo e abertura permanecem intactos.

## Arquivos
Criados: src/joca/knowledge.ts, src/joca/chat-service.ts, src/joca/JocaChat.tsx, src/joca/joca-chat.css, public/images/joca-avatar.png, tests/joca-chat.spec.ts e este relatório.
Modificados: src/App.tsx, src/content.ts, src/schedule-contact.ts, src/media-authorization.json, tests/institutional.spec.ts, tests/home-redesign.spec.ts, tests/schedule-contact.spec.ts, README.md.
Sem dependências novas. Backups seletivos em .local/site006a-before.

## Verificação
Executados npm run lint, npm run build e npm test.
Testes: FAQs/idade/fallback, envio/recebimento local, encaminhamento, quatro modalidades, avatar fixo na rolagem, foco/Tab/Escape, retorno ao acionador, estado sem persistência, reinício após reload, falha do serviço, ausência de grade interna/chaves/endpoints de IA no build e regressões da homepage/Joca.
Ajustes durante validação: escape de regex de idade corrigido; expectativa de teste alinhada ao texto “nem garante vaga”; pergunta por turma/idade encaminhada à regra de idade.
Verificadas larguras 320/375/768/1024/1440 e altura reduzida de 500 px. Não foi usado teclado físico de celular; adaptação foi exercitada no navegador com viewport reduzido.
Hashes da abertura Joca e baseline DANZIA conferidos sem alteração. Galerias e fotografias preservadas.
Capturas: .local/site006a-avatar-{desktop,mobile}.png e .local/site006a-chat-{desktop,mobile}.png; chat mostra conversa sobre modalidades e horários.
Nada publicado; nenhum DNS alterado. Aguardar inspeção visual antes de integrar IA real.
Resultado final: lint aprovado; build aprovado com 24 mídias verificadas; 32 testes aprovados. Capturas desktop/mobile geradas e painel conferido visualmente.
