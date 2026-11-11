# SITE-JOYCE-005 — Entrega local

Prévia com fotografia e galerias: http://127.0.0.1:5175/ (npm run dev:review).
Prévia sem fotografias privadas: http://127.0.0.1:5174/ (npm run dev).

## Implementação
Hero editorial com título/subtítulo fornecidos, fotografia de acolhimento integral apenas no modo de revisão, botões WhatsApp e navegação interna. Logo oficial preservada no cabeçalho.
Modalidades Baby (2–3), Pré-Ballet (4–6), Infantil (7–10), Preparatório (10–13), com confirmação final pendente visível. Horários continuam a confirmar.
Chamada de aula experimental abre WhatsApp com a mensagem fornecida, sem agendamento automático ou promessa de vaga.
Quatro Estações 2026 recebeu seção própria e cartaz integral. Nenhuma data, local, horário ou disponibilidade de ingressos foi inventada.
Contatos principal/alternativo, Instagram e pesquisa Google Maps usam os dados fornecidos; links externos têm nova aba e noopener noreferrer. Testes validam os destinos, sem enviar mensagens ou executar ações nos serviços externos.
Nossa Escola, Fundadora, Equipe, galerias, lightbox e abertura Joca preservados. Hashes da implementação/testes da Joca e baseline DANZIA conferidos, sem alteração.

## Assets e controle editorial
Encontrados espetaculo-quatro-estacoes-2026.png.png e modalidades-ballet-joyce.png.png.
O cartaz fornecido foi copiado integralmente para public/images/espetaculo-quatro-estacoes-2026.png, conforme solicitado; seu original foi preservado em .local/private-media/images.
O material de modalidades contém crianças e foi preservado nessa mesma área privada, fora de public e dist. Não é exibido.
A lista de assets públicos foi ampliada apenas para o cartaz institucional solicitado. As proteções de mídia e o vínculo do servidor a 127.0.0.1 permanecem intactos.
As fotografias privadas e a imagem do Hero permanecem fora do build. Nenhum original foi excluído ou editado.

Pendências: confirmar faixas etárias antes de publicar e reconciliar o texto promocional anterior de 4 a 17 anos (registrado em src/content.ts); confirmar horários; fornecer detalhes adicionais do espetáculo; confirmar alcance de autorização para divulgação das fotografias na internet e restrições individuais; autorizar expressamente a publicação.

## Verificação
Comandos: npm run lint, npm run build, npm test.
Larguras 320, 375, 768, 1024, 1440 px; teclado e menu; links; galerias/lightbox; regressão da Joca; ausência de mídia privada em dist.
Corrigido transbordamento do estado sem fotografia do Hero em 320 px, detectado pelos testes anteriores.
Expectativas antigas de contato indisponível e faixas vazias foram atualizadas para os dados confirmados, sem remoção de cenários.
Capturas: .local/site005-homepage-{desktop,mobile}.png, .local/site005-hero-{desktop,mobile}.png e .local/site005-quatro-estacoes-{desktop,mobile}.png.

## Arquivos
Criados: src/HomeHighlights.tsx, src/home-highlights.css, tests/home-redesign.spec.ts, public/images/espetaculo-quatro-estacoes-2026.png e este relatório.
Modificados:
- vite.private-media.ts
- scripts\check-production-media.mjs
- src\App.tsx
- src\content.ts
- tests\gallery.spec.ts
- tests\homepage.spec.ts
- tests\institutional.spec.ts
- README.md.
Arquivos originais movidos para .local/private-media/images conforme descrito acima; cópias anteriores do código em .local/site005-before para recuperação seletiva.
Nenhuma dependência nova. Nada publicado, nenhum DNS alterado. Encerramento nesta etapa para inspeção visual.
Resultado final: lint aprovado; build aprovado (8 arquivos, nenhuma fotografia privada); 20 testes aprovados em Microsoft Edge. Capturas desktop 1440 px e mobile 375 px geradas. Hero e cartaz conferidos visualmente.
