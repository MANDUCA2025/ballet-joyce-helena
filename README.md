# Joyce Helena — Escola de Ballet

Site institucional em React, TypeScript e Vite. Desenvolvido por **MANDUCA TECH**.

## Execução e validação

Node.js 24.13.0 ou compatível com o requisito do package.json.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm test
npm run test:public
```

`npm run test:public` usa Python disponível no sistema para servir exclusivamente `dist/`, sem backend, Worker ou endpoint de IA. Os testes anteriores usam serviços locais simulados, sem inferência real.

## Produção estática

O build de produção substitui o adaptador de chat pelo `public-chat-runtime.ts`. A Jóca utiliza somente respostas programadas e links oficiais de WhatsApp. Não consulta configurações de API e não importa clientes Gemini ou Workers AI para o bundle público. Variáveis de ambiente não habilitam IA nesse build.

As provas de conceito anteriores permanecem isoladas no código de desenvolvimento e não são publicadas por Pages. Não cadastrar bindings, secrets, Functions ou scripts de deploy para hospedar este site. Não colocar arquivos de ambiente, relatórios ou backups em `public/`.

As 24 mídias públicas são verificadas pelo manifesto de autorização e SHA-256 durante o build. Novas imagens precisam de autorização expressa antes de entrar em `public/`.

## Cloudflare Pages — configuração para revisão acompanhada

| Campo | Valor |
| --- | --- |
| Repositório existente | MANDUCA2025/ballet-joyce-helena |
| Framework preset | React (Vite) |
| Branch de produção | main |
| Build command | npm run build |
| Build output directory | dist |
| Root directory | raiz do repositório (deixar vazio) |
| Versão do Node | 24.13.0, fixada em .node-version |
| Domínio pretendido | joycehelenaballet.com.br |

O projeto Pages deve ser criado pela integração Git, escolhendo somente este repositório. A primeira conexão pode iniciar um build/publicação: realizá-la apenas após a liberação editorial e a revisão do commit. O endereço pages.dev pode ser validado antes do domínio final. A configuração do domínio/DNS ficará para acompanhamento da Central de Comando; não foi realizada automaticamente.

Documentação: [integração GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [build](https://developers.cloudflare.com/pages/configuration/build-configuration/) e [domínios](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Situação de publicação

AUT-SITE-007C-001 confirma a biografia e os quatro nomes/funções da equipe e autoriza commit/push da versão institucional. Jóca permanece programada, sem IA. Faixas etárias não homologadas continuam ausentes. A criação de Cloudflare Pages e a configuração de domínio/DNS aguardam autorização separada.

Relatórios e o arquivo histórico editorial/site007a-withdrawn.md permanecem apenas no computador. O teste de integridade da biografia usa o SHA-256 do texto aprovado, sem depender de documentos privados.
