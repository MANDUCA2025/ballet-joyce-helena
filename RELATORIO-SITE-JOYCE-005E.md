# SITE-JOYCE-005E — Refinamento e preparação para Joca

Prévia: http://127.0.0.1:5174/ — npm run dev.

- Horários e observações de turmas removidos da interface e do JavaScript de produção. Fonte preservada em editorial/november-schedule.ts, sem dados pessoais, sem importação pelo frontend e bloqueada no servidor Vite.
- Pendências de faixas etárias, divergência 4–17 anos, biografia e conferência da planilha mantidas em editorial/pending.md. Remover avisos internos não aprova os conteúdos.
- Quatro links com aparência de botão “Consultar horários”, um por modalidade. Mensagem personalizada e codificada, WhatsApp principal 5514998519343, nova aba com noopener noreferrer.
- src/schedule-contact.ts centraliza whatsapp (ativo) e joca (desabilitado, sem destino). Caso a configuração seja alterada prematuramente, a interface mantém o WhatsApp funcional. Nenhum chat/API/IA/agendamento foi implementado.
- MANDUCA TECH com destaque tipográfico discreto; removida a mensagem de prévia do rodapé.
- Hero mantém a fotografia e agora usa “Cada conquista merece ser celebrada.”, sem legenda técnica.
- Galerias intactas. Joca e DANZIA conferidos contra baseline sem alteração. Todas as mídias originais preservadas por SHA-256. Sem dependências, DNS ou publicação.

## Arquivos
Criados: src/schedule-contact.ts, editorial/november-schedule.ts, editorial/pending.md, tests/schedule-contact.spec.ts e este relatório.
Modificados:
- vite.config.ts
- src\App.tsx
- src\brand-schedules.css
- src\content.ts
- src\HomeHighlights.tsx
- src\SchoolPresentation.tsx
- src\styles.css
- tests\hero-schedules.spec.ts
- tests\home-redesign.spec.ts
- tests\institutional.spec.ts
- README.md.
Backups seletivos em .local/site005e-before.

## Verificação
Lint, build e suíte completa executados. Cenários anteriores de horários adaptados para validar a fonte editorial, sem retirar cobertura da Joca, das galerias, contatos e responsividade.
Testes novos validam as quatro mensagens exatas, número oficial, codificação, nova aba, foco por teclado, ausência de horários no DOM e bundle, bloqueio HTTP do arquivo editorial e Joca desabilitada.
A abertura do WhatsApp foi testada com destino interceptado: nenhuma mensagem ou requisição foi enviada ao serviço.
Larguras: 320, 375, 768, 1024 e 1440 px.
Capturas do build em .local/site005e-modalidades-{desktop,mobile}.png e .local/site005e-footer-{desktop,mobile}.png.
Encerrado para aprovação visual, sem iniciar outra etapa.
Resultado final: lint aprovado; build aprovado (23 mídias verificadas); 27 testes aprovados. Capturas desktop/mobile geradas no build normal.
