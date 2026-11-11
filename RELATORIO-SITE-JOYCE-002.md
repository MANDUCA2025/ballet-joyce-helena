# SITE-JOYCE-002 — Abertura com a Joca

Entregue localmente em 10/11/2026: http://127.0.0.1:5174.

Componente JocaIntro separado, coordenado por Site. Vídeo oficial existente preservado por SHA-256, sem recodificação: 1280 × 720, 16:9, duração observada de 10,026667 segundos. Fundo rosa/marfim e detalhe dourado; object-fit: contain; controles fora do vídeo.

Reprodução automática sem som. Ativar/Desativar som por ação explícita. Pular apresentação e Escape permitem sair; Tab/Shift+Tab mantêm foco nos controles. Saída em até 10 segundos mais transição de 240 ms, ou término da mídia. Falha de vídeo, rejeição de autoplay ou carregamento sem dados em 4 segundos liberam a homepage. sessionStorage evita repetição na mesma sessão. Armazenamento bloqueado não impede o uso, mas impossibilita memorizar a escolha entre recarregamentos.

Com movimento reduzido, a abertura automática é omitida e a transição desativada. Replay manual continua disponível na seção da Joca, com foco devolvido ao botão ao sair.

## Arquivos

Criados: src/JocaIntro.tsx, src/Site.tsx, src/joca-intro.css, tests/intro.spec.ts e este relatório.

Modificados: src/main.tsx, src/App.tsx (botão de replay), eslint.config.js (global DOM), tests/homepage.spec.ts (sessão já apresentada; mesmos cenários) e README.md.

Vídeo existente intacto. Nenhuma dependência adicionada. Artefatos locais de build, testes e capturas atualizados.

## Validação

Lint e build aprovados. Nove testes Playwright no Edge aprovados: três da homepage e seis da abertura. Cobrem primeira visita, mídia real, som manual, teclado, Pular, retorno na mesma sessão, replay, saída automática, vídeo 404, autoplay rejeitado, armazenamento bloqueado, movimento reduzido e desktop/mobile.

Durante a validação foram corrigidos o ciclo de Tab e a restauração de foco ao sair do replay. Capturas inspecionadas: .local/site002-intro-desktop.png (1440 × 1000) e .local/site002-intro-mobile.png (375 × 812). Vídeo proporcional, controles visíveis e fora da imagem.

DANZIA preservado por comparação dos hashes de código/documentação. Sem banco, backend, IA, atendimento automatizado ou publicação. Aguardando aprovação visual, sem avanço de etapa.
