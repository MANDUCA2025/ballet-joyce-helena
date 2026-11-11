# SITE-JOYCE-004A — Galerias fotográficas

Implementadas seis fotografias de aulas, três registros de 2024 e cinco de 2025. Todas as 14 foram encontradas com extensão duplicada .png.png; nenhum arquivo ausente e nenhuma imagem artificial utilizada.

## Revisão local
Executar npm run dev:review e abrir http://127.0.0.1:5175.
npm run dev mantém a prévia anterior em http://127.0.0.1:5174.
O modo de revisão só existe no servidor de desenvolvimento, vinculado a 127.0.0.1; não usar túnel, proxy público ou hospedagem. O plugin rejeita host aberto e requisições de imagens de outra origem. O diretório .local é bloqueado pelo servidor e ignorado pelo Git.

## Autorização e preservação
A direção informou em 10/11/2026 que possui autorizações assinadas pelos responsáveis e liberou expressamente a prévia local. Registro editorial em src/gallery-content.ts: localPreviewAuthorized=true e authorized=false (publicação ainda não confirmada).
Antes de publicar, confirmar cobertura para divulgação na internet e ausência de restrições individuais; obter autorização expressa para publicação. Nenhum documento pessoal foi armazenado.

As fotografias foram MOVIMENTADAS de public/images para .local/private-media/images, preservando nomes, bytes, marcas d'água e créditos. As seis cópias/originais institucionais de SITE-JOYCE-004 também foram preservadas nessa área local, permanecendo disponíveis no desenvolvimento. Não houve exclusão de originais. O inventário local contém caminhos, dimensões e SHA-256; os testes conferem sua integridade.
Nenhuma dessas fotografias integra dist. A lista pública permite apenas logo, imagens da Joca e vídeo original. Build bloqueia arquivos adicionais em public e verifica os hashes privados no resultado.

## Interface e validação
Grade compacta de duas colunas no celular e três no desktop, imagens inteiras com object-fit: contain, dimensões reservadas e carregamento lazy. Lightbox nativo modal, controles de anterior/próxima, setas, Tab/Shift+Tab, Escape e restauração do foco. Movimento reduzido respeitado.
Validação em 320, 375, 768, 1024 e 1440 px. Capturas completas e por seção em .local/site004a-*.png.
Comandos: npm run lint; npm run build; npm test.
Ajustes de desenvolvimento: corrigida tipagem da seleção de coleção e leitura de import.meta.env nos testes Node. O teste de build passou a distinguir diretórios vazios de imagens.
Abertura Joca e seus testes intactos; hashes conferidos. Arquivos do DANZIA conferidos contra baseline, sem alteração.

## Arquivos criados ou modificados
- src/PhotoGallery.tsx, src/photo-gallery.css, src/gallery-content.ts: galerias, lightbox e manifesto editorial.
- src/App.tsx, src/SchoolPresentation.tsx: integração das coleções.
- src/content.ts: fotografias institucionais somente em desenvolvimento.
- vite.private-media.ts, vite.config.ts, vite-env.d.ts: mídia local e separação de produção.
- scripts/check-production-media.mjs, package.json: proteção e comandos de revisão/build.
- playwright.config.ts, tests/gallery.spec.ts, eslint.config.js: servidor de revisão e testes novos.
- README.md e este relatório.
- .local/private-media/inventory.json, originais preservados e capturas locais (ignorados pelo Git).
Nenhuma dependência adicionada. Nenhuma publicação realizada.

## Inventário das 14 fotografias
| Caminho solicitado em public/images | Original encontrado | Situação |
|---|---|---|
| escola/aula-acolhimento.png | images/escola/aula-acolhimento.png.png | Preservado na área local; disponível na revisão |
| escola/aula-acompanhamento.png | images/escola/aula-acompanhamento.png.png | Preservado na área local; disponível na revisão |
| escola/aula-desenvolvimento.png | images/escola/aula-desenvolvimento.png.png | Preservado na área local; disponível na revisão |
| escola/aula-tecnica.png | images/escola/aula-tecnica.png.png | Preservado na área local; disponível na revisão |
| escola/aula-primeiros-passos.png | images/escola/aula-primeiros-passos.png.png | Preservado na área local; disponível na revisão |
| escola/aula-convivencia.png | images/escola/aula-convivencia.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2024/2024-apresentacao-01.png | images/espetaculos/2024/2024-apresentacao-01.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2024/2024-apresentacao-02.png | images/espetaculos/2024/2024-apresentacao-02.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2024/2024-apresentacao-03.png | images/espetaculos/2024/2024-apresentacao-03.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2025/2025-apresentacao-01.png | images/espetaculos/2025/2025-apresentacao-01.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2025/2025-apresentacao-02.png | images/espetaculos/2025/2025-apresentacao-02.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2025/2025-apresentacao-03.png | images/espetaculos/2025/2025-apresentacao-03.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2025/2025-apresentacao-04.png | images/espetaculos/2025/2025-apresentacao-04.png.png | Preservado na área local; disponível na revisão |
| espetaculos/2025/2025-apresentacao-05.png | images/espetaculos/2025/2025-apresentacao-05.png.png | Preservado na área local; disponível na revisão |

Resultado final: lint aprovado; build aprovado (7 arquivos, zero fotografias privadas); 18 testes aprovados, incluindo os 14 cenários anteriores. Capturas desktop 1440 px e mobile 375 px geradas e conferidas visualmente.
