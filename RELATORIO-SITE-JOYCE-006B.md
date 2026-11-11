# SITE-JOYCE-006B — Refino mobile da Jóca

Prévia local: http://127.0.0.1:5174/ (npm run dev). Nada publicado.

## Melhorias mobile
- Launcher em peça única, compacto: avatar oficial de 42 px, área de toque superior a 44 px, texto “Fale com a Jóca” legível, borda rosa e sombra suave.
- Margens de 12 px somadas às áreas seguras inferior/laterais; fixo no canto inferior direito, sem encostar nas bordas.
- Chat em painel flutuante inferior, quase toda a largura, cantos arredondados e altura máxima de 720 px limitada à área visível. Abaixo de 768 px aplica o layout de sheet.
- Cabeçalho, fechar, encaminhamentos e composição permanecem fixos no painel. Somente a região das mensagens rola; aviso de atendimento programado/privacidade preservado nessa região e status “sem IA” mantido visível.
- Balões mais espaçosos, texto de 15 px, separação de 16 px e diferenciação clara entre visitante e Jóca.
- Campo com 16 px e indicação de tecla enviar; botão fechar de 44 px. Ao abrir no celular o foco vai ao fechar, evitando chamar o teclado automaticamente. Ao tocar no campo, digitação funciona normalmente.
- visualViewport acompanha altura, largura e deslocamento; fallback usa innerHeight/innerWidth e resize da janela. O painel se reposiciona acima da área ocupada pelo teclado.
- Desktop mantém painel de 380 px e avatar de 60 px, com acabamento e espaçamento refinados.

## Preservação
Serviço de respostas, base oficial, configuração de encaminhamento, galerias, vídeo e abertura da Jóca intactos por hash. DANZIA conferido contra baseline sem alterações.
Não houve instalação, Gemini/IA, backend, API externa nova, banco ou persistência de histórico. Esc, foco visível, retorno ao acionador e navegação por teclado preservados.

## Arquivos
- src/joca/joca-chat.css: launcher, sheet, mensagens e controles.
- src/joca/JocaChat.tsx: viewport, foco mobile, posição dos avisos e enterKeyHint.
- tests/joca-chat.spec.ts: dimensão esperada do avatar mobile atualizada.
- tests/joca-mobile.spec.ts: testes novos de layout, teclado/viewport, foco, scroll e capturas.
- README.md e este relatório.
Backup seletivo: .local/site006b-before. Evidência de preservação: .local/site006b-preservation.json.

## Validação
npm run lint e npm run build aprovados; 35 testes aprovados no Microsoft Edge.
Larguras 320, 375, 768, 1024 e 1440 px. Testes de margens, acionador fixo, foco inicial/retorno, altura/posição do sheet, scroll independente, viewport reduzido e fallback sem visualViewport.
Teclado simulado com visualViewport de 340 px e deslocamento de 48 px: campo e controles dentro da área visível. Não foi realizada inspeção em aparelho físico/iOS; o teste não equivale a essa inspeção.
Capturas conferidas: .local/site006b-launcher-desktop.png, site006b-launcher-mobile.png, site006b-chat-desktop.png, site006b-chat-mobile.png. Evidência adicional: site006b-chat-keyboard-simulated.png.
Aguardar aprovação visual antes de qualquer próxima etapa.
