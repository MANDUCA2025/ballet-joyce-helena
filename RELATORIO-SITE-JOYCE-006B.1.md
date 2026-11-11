# SITE-JOYCE-006B.1 — Revisão da interface da Jóca
Data: 11/11/2026. Prévia: http://127.0.0.1:5174/ — npm run dev.
Status: revisão implementada e validada nos navegadores disponíveis; NÃO é homologação total em aparelhos físicos.

## Auditoria antes de alterações
Inspecionados JocaChat.tsx, joca-chat.css, serviço de respostas e cenários anteriores. Auditoria interativa local reproduziu:
- Leitor no topo do histórico (scrollTop 0) foi deslocado automaticamente para 1362 px ao chegar uma resposta.
- Launcher continuava visível atrás do diálogo.
- Bloqueio da página usava apenas overflow, sem guardar/restaurar explicitamente a posição.
- Mensagem de erro não possuía ação direta para tentar novamente.
- Alturas pequenas destinavam pouco espaço às mensagens; aviso inicial vinha antes da saudação.
- Eventos resize/scroll de viewport faziam atualizações imediatas separadas.
Nenhuma alteração estética ampla foi realizada.

## Correções
- Scroll segue novas mensagens quando o visitante está no fim ou envia uma pergunta. Quem lê mensagens anteriores permanece na posição e recebe o botão “Ver última resposta”.
- Saudação antes do aviso informativo; aviso de respostas locais, privacidade e identificação sem IA preservados.
- Pergunta aparece imediatamente. Indicador apenas durante a execução da Promise; nenhum atraso artificial no serviço real.
- Envios vazios/duplicados continuam bloqueados; limite de 500 caracteres mantido. Falha oferece Tentar novamente, reutilizando a pergunta sem duplicá-la.
- Respostas pendentes são canceladas ao fechar; resultados tardios não alteram a conversa.
- Fundo fica fixo com coordenadas preservadas, compensação da barra de rolagem e restauração de estilos/posição ao fechar.
- Launcher oculto enquanto o diálogo está aberto; foco retorna ao botão que o acionou.
- Geometria do visualViewport aplicada também à posição/largura desktop, com safe areas. Modo compacto abaixo de 360 px de altura mantém cabeçalho e entrada acessíveis.
- Listeners registrados uma vez por abertura, removidos no fechamento; eventos agrupados via requestAnimationFrame, com cancelamento ao desmontar.
- Links de encaminhamento com alvo mínimo de 44 px, foco visível e tratamento de cores forçadas. Sem alteração de URLs.
- Semântica de diálogo, histórico com anúncio polite, Escape e ciclo Tab/Shift+Tab preservados.

## Arquivos modificados/criados
- src/joca/JocaChat.tsx
- src/joca/joca-chat.css
- tests/joca-audit.spec.ts (novo)
- playwright.chrome.config.ts (novo)
- README.md
- Este relatório.
Backup seletivo em .local/site006b1-before.
Os testes anteriores foram preservados. Nenhuma dependência instalada.
Demais fontes de src e baseline DANZIA conferidos por SHA-256 sem alterações. Todas as 24 mídias conferidas no build, incluindo vídeo e avatar. Textos institucionais, modalidades, contatos, galerias, espetáculo e assinatura preservados.

## Evidências de validação
- npm run lint: aprovado.
- npm run build: aprovado, 24 mídias conferidas por SHA-256.
- npm test: 40 testes aprovados em Microsoft Edge 157.0.4341.46.
- npx playwright test --config=playwright.chrome.config.ts: 13 testes complementares aprovados em Google Chrome 142.0.7444.163.
Ambos estavam instalados; são navegadores da família Chromium, não evidência de compatibilidade Safari/WebKit.

Cobertura adicional: 320, 375, 390, 768, 1024, 1440 px; horizontais 844×280, 667×260 e captura 844×320; alturas reduzidas; teclado simulado via visualViewport com offset; fallback sem visualViewport; histórico interno; leitura preservada e última resposta; ciclos de abertura/fechamento; fundo sem deslocamento e restauração exata; foco; resposta rápida, atrasada e falha/retentativa; duplicatas; vazio; limite; cancelamento tardio; retorno a zero de listeners de viewport após fechamento.
Escala de página 200% exercitada via CDP com visualViewport real, além dos testes de reflow em larguras reduzidas. Não representa teste de pinch físico ou de todos os atalhos de zoom.
Contraste calculado do texto principal dos balões sobre seu fundo supera 4,5:1. Não é auditoria WCAG integral.
Preservados todos os testes anteriores da Jóca/vídeo, contatos, imagens e interface.

## Capturas
Em .local/:
- site006b1-edge-desktop.png
- site006b1-edge-mobile.png
- site006b1-edge-landscape.png
- site006b1-edge-keyboard.png
- site006b1-edge-zoom200.png
Há equivalentes com prefixo site006b1-chrome.
As capturas foram inspecionadas; orientação horizontal permite rolar a mensagem com cabeçalho e campo fixos.

## Limitações para homologação
Ainda requer teste real em Android/iOS: teclado do sistema, barra do navegador, rotação com teclado aberto, notches/safe areas reais, VoiceOver/TalkBack, zoom/pinch e comportamento Safari.
Testes automatizados de cleanup não substituem perfil de heap prolongado; não foi feito ensaio de longa duração.
Não houve Gemini, API externa, backend, persistência, publicação ou DNS. Aguardar inspeção visual e validação em aparelho físico antes de declarar homologação total.
