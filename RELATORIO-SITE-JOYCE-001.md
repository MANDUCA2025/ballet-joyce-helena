# SITE-JOYCE-001 — Fundação e Homepage

Entregue em 10/11/2026. Projeto independente em site-joyce-helena, na raiz do diretório BALLET JOYCE HELENA. Acesso local: http://127.0.0.1:5174.

Homepage React + TypeScript + Vite com as oito seções solicitadas, CSS mobile-first, tipografia local, logo oficial, menu mobile com Escape e foco, links internos e preferência de movimento reduzido. Sem marca DANZIA no site, backend, banco, autenticação, formulário ou publicação.

Os três assets foram copiados sem alteração do original. Os caminhos joca-personagem.png e joca-perfil.png estão disponíveis e possuem fallback visual caso faltem. A Joca é apenas ilustrativa; não há atendimento ou IA ativa. Fotografias, história, contatos, horários e informações específicas aguardam aprovação oficial. Botões sem destino estão desabilitados e explicados.

## Verificações

- npm run lint: aprovado.
- npm run build: aprovado.
- npm test: 3 testes Playwright aprovados no Microsoft Edge.
- Desktop 1440 px e mobile 375 px: capturas completas e do hero inspecionadas.
- Larguras 320, 375, 768 e 1440 px: sem transbordamento horizontal.
- Testados teclado, abrir/fechar menu, Escape, navegação interna, botões desabilitados, ausência de formulários, ausência de requisições externas, assets carregados e ausência dos dois assets da Joca.
- Corrigida tipagem de HTMLImageElement em um teste que inicialmente impedia o build. Removido efeito de composição que alterava a cor aparente da logo.
- Arquivos de código/documentação do DANZIA comparados por SHA-256 com o estado anterior e preservados. Nenhum comando de banco ou execução de scripts do DANZIA.

## Capturas

- .local/homepage-desktop-1440.png
- .local/homepage-mobile-375.png
- .local/hero-desktop-1440.png
- .local/hero-mobile-375.png

## Arquivos criados

- `.gitignore`
- `README.md`
- `RELATORIO-SITE-JOYCE-001.md`
- `eslint.config.js`
- `index.html`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `public/images/joca-perfil.png`
- `public/images/joca-personagem.png`
- `public/images/logo-joyce-helena.jpg`
- `src/App.tsx`
- `src/components.tsx`
- `src/main.tsx`
- `src/styles.css`
- `tests/homepage.spec.ts`
- `tsconfig.json`
- `vite-env.d.ts`
- `vite.config.ts`

Gerados localmente: node_modules/, dist/, test-results/ e .local/ (capturas e registro de preservação). Comandos de execução e validação no README.md. Servidor local mantido em execução para inspeção. Nenhuma página interna desenvolvida.
