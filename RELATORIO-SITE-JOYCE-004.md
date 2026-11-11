# SITE-JOYCE-004 — Nossa Escola, Fundadora e Equipe

Entrega local em 10/11/2026: http://127.0.0.1:5174/#escola.

## Resultado

Três seções responsivas com os textos fornecidos, centralizados em src/content.ts. Fotografia da aula em preto e branco, retrato individual da fundadora e fotografia da equipe sem identificar pessoas pela posição. História completa da fundadora em expansão acessível, com botão funcional, teclado, aria-expanded e aria-controls. Equipe com resumo inicial e expansão complementar para evitar bloco longo no celular. Aviso de revisão da Joyce antes da publicação mantido.

As fotos inicialmente não existiam nos nomes pedidos. Foram encontradas com extensão duplicada .png.png e copiadas integralmente para os nomes .png esperados, sem substituir os originais ou inventar imagens. Fallback mantém seções disponíveis quando um arquivo falha.

## Arquivos

Criados: src/SchoolPresentation.tsx, src/school-presentation.css, tests/school-presentation.spec.ts, este relatório e os três assets public/images/joyce-helena-{nossa-escola,fundadora,equipe}.png.

Modificados: src/content.ts, src/App.tsx, src/components.tsx (carregamento das fotos institucionais), src/styles.css (ocultação visual do link de salto quando sem foco), tests/institutional.spec.ts (novo rótulo e escopo da galeria), tests/homepage.spec.ts (fallback da Joca inclui JPG), README.md.

Artefatos gerados: dist/, test-results/ e capturas .local/site004-{escola,fundadora,equipe,sections}-{desktop,mobile}.png.

## Validação

Lint e build aprovados. Suíte de 14 testes aprovada: 11 anteriores mantidos e 3 novos para história completa/teclado, falha das três fotos e responsividade/capturas. Larguras 320, 375, 768, 1024 e 1440 px. Desktop 1440 px e mobile 375 px inspecionados nas capturas.

Correções durante a validação: limite mínimo de largura de grid no celular; carregamento previsível das três fotos; seletor do botão após mudança de nome na expansão; link de salto fora de foco não aparece em capturas longas.

Código/CSS e testes da abertura, dependências e DANZIA conferidos por hashes e preservados. Nenhuma biblioteca instalada. A referência antiga da imagem Joca apontava para PNG ausente; o arquivo disponível é JPG. Mantidos todos os arquivos de mídia encontrados no início das edições, confirmados por hash; ajustado apenas o caminho da imagem para JPG e a interceptação no teste de fallback. O agente não editou, recodificou ou substituiu o vídeo/imagem da Joca. Os testes da abertura passaram usando o vídeo atual.

Sem backend, banco, IA funcional, publicação, DNS ou páginas internas. Textos sujeitos à revisão final da Joyce. Aguardando aprovação visual, sem avanço de etapa.
