# SITE-JOYCE-005B — Unificação das mídias públicas

Execução única: npm run dev — http://127.0.0.1:5174/.
O comando dev:review, o modo de revisão, o plugin de mídia privada e as rotas especiais foram removidos da aplicação. Vite mantém acesso local; não houve publicação nem alteração de DNS.

## Entrega
- 14 fotografias de galerias + Nossa Escola, Fundadora e Equipe copiadas para public/images nos nomes padronizados. O Hero reutiliza escola/aula-acolhimento.png.
- SHA-256 das 17 cópias conferido contra o inventário original, sem alteração dos bytes. Originais conservados apenas como arquivo histórico local, sem dependência operacional.
- Os 22 assets públicos (17 fotografias, logo, duas imagens Joca, cartaz e vídeo) são verificados por SHA-256 antes e depois do build.
- Nenhuma extensão duplicada nos nomes públicos. Nenhum documento de autorização ou arquivo administrativo em public.
- src/media-authorization.json registra a autorização expressa do SITE-JOYCE-005B para futura divulgação na internet. Novos assets permanecem sem autorização por padrão e fora de public; o verificador rejeita arquivos não registrados/autorizados.
- Layout e textos institucionais preservados. Apenas os antigos avisos de prévia privada foram ajustados ao novo status de autorização.
- Joca (código, estilos, coordenador e testes) e DANZIA conferidos por hash, sem mudanças. Nenhuma dependência instalada.
- README atualizado para a operação unificada. Relatórios anteriores permanecem como histórico.

## Testes
Lint e build executados. Testes cobrem carregamento real dos 22 assets via HTTP no build normal (4174), hashes public/dist, 14 galerias, Hero, escola/fundadora/equipe, teclado, Escape, retorno do foco, navegação, contatos, abertura Joca e responsividade.
Teste adicional verifica rejeição de novo arquivo sem autorização. As antigas verificações de restrição local foram substituídas pelas verificações do novo escopo público, mantendo os cenários de interface.
Durante a validação, duas fixtures precisaram de quebra de linha ao injetar alterações no módulo Vite: o comentário de source map impedia sua execução. Corrigidas sem alterar o comportamento da aplicação.
Larguras verificadas: 320, 375, 768, 1024 e 1440 px.
Capturas do build normal: .local/site005b-homepage-desktop.png, .local/site005b-homepage-mobile.png e recortes site005b-hero-desktop.png / site005b-hero-mobile.png.
Evidência de integridade das 17 fotos: .local/site005b-integrity.json.

## Arquivos
Novos: src/media-authorization.json; 17 fotografias em public/images; este relatório.
Removido do código ativo: vite.private-media.ts (cópia histórica preservada).
Modificados:
- package.json
- playwright.config.ts
- README.md
- vite-env.d.ts
- vite.config.ts
- vite.private-media.ts
- scripts\check-production-media.mjs
- src\App.tsx
- src\content.ts
- src\gallery-content.ts
- src\HomeHighlights.tsx
- src\PhotoGallery.tsx
- src\SchoolPresentation.tsx
- tests\gallery.spec.ts
- tests\home-redesign.spec.ts
- tests\homepage.spec.ts
- tests\institutional.spec.ts
- tests\school-presentation.spec.ts

Encerrado nesta etapa para aprovação visual. Publicação não realizada.
Resultado final: lint aprovado, build aprovado, 21 testes aprovados. 22 assets públicos conferidos por SHA-256 e HTTP no build; 17 fotografias idênticas às originais. Capturas desktop/mobile geradas a partir do build normal.
