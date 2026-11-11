# SITE-JOYCE-003 — Conteúdo institucional

Entrega local de 10/11/2026: http://127.0.0.1:5174.

Conteúdo centralizado em src/content.ts; texto institucional provisório identificado; modalidades com campos de faixa etária, descrição e horários; espaço para foto real da Joyce ou ambiente; galeria responsiva com três espaços e controle editorial de autorização. Joca com texto sugerido, aviso de atendimento inativo e apenas o replay original. Contatos vazios e indisponíveis, preparados para futura integração autorizada.

## Arquivos

Modificados: src/App.tsx, src/components.tsx, src/styles.css e README.md.
Criados: src/content.ts, tests/institutional.spec.ts e este relatório.
Capturas completas: .local/site003-homepage-desktop.png e .local/site003-homepage-mobile.png.
Artefatos locais gerados: dist/, test-results/ e .local/.

## Validação

Lint e build aprovados. Onze testes Playwright no Edge: nove anteriores intactos e dois novos cenários para campos pendentes e galeria/autorização/falha de imagem. Verificadas larguras 320, 375, 768, 1024 e 1440 px, sem transbordamento horizontal. Capturas completas desktop 1440 px e mobile 375 px inspecionadas. Mantidos menu, teclado e testes da abertura, áudio, sessão, replay, falhas e movimento reduzido.

O novo teste de falha de foto inicialmente não interceptava o parâmetro de atualização do Vite; corrigido o padrão de URL e repetida a validação.

Preservação por hashes: componentes e CSS da abertura, testes anteriores, vídeo, demais imagens, dependências e arquivos de código/documentação do DANZIA intactos. A única divergência nos arquivos protegidos foi public/images/joca-personagem.png, substituído durante a tarefa fora das edições executadas pelo agente. Mantido o arquivo atual; build, testes e capturas atualizados após a detecção. O original da pasta de identidade visual não foi alterado pelo agente.

## Informações ainda necessárias para publicação

- Aprovação do texto institucional e apresentação oficial da Joyce/equipe; história somente se fornecida e confirmada.
- Foto real da Joyce ou ambiente, texto alternativo e autorização de uso.
- Fotos de apresentações, legendas e autorizações apropriadas, incluindo responsáveis legais por crianças.
- Faixa etária, descrição pedagógica e horários confirmados de cada modalidade.
- WhatsApp, perfil do Instagram e endereço/localização oficiais.
- Orientações de disponibilidade e agendamento de aula experimental.

O campo authorized é confirmação editorial, não substitui documentos de autorização. Sem autorização, fotos não são requisitadas. Campos de contato reservados não ativam links ou atendimento automaticamente nesta etapa.

Sem backend, banco, autenticação, IA funcional, dependências novas, publicação, DNS ou páginas internas. Aguardando inspeção visual, sem avanço de etapa.
