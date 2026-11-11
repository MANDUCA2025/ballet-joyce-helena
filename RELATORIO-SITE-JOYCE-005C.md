# SITE-JOYCE-005C — Hero, identidade e horários

Prévia: http://127.0.0.1:5174/ — npm run dev.

## Resultado
Nova fotografia confirmada e copiada byte a byte para public/images/hero-joyce-helena.png. SHA-256 conferido com o original, public e dist. Original preservado em .local/originals/hero-joyce-helena.png.png, fora do build para evitar extensão duplicada. Registro editorial atualizado; 23 mídias públicas verificadas.
Hero usa exclusivamente a nova imagem, inteira, com proporção preservada. Textos, botões e legenda mantidos; fotografia anterior continua na galeria.
Logo oficial: 88 px desktop, 60 px mobile; nome em destaque e subtítulo legível. Cores e imagem oficial preservadas.
Grade centralizada em src/content.ts com apenas identificador editorial, dias, horário e observação de modalidade. Sábado às 11h é um único registro compartilhado pelos cartões Infantil e Preparatório.

## Horários — referência novembro de 2026
| Modalidade | Grade |
|---|---|
| Baby | Segunda 18h; quarta 18h; sábado 10h |
| Pré-Ballet | Terça 19h; quinta 19h; sábado 9h |
| Infantil | Segunda 19h; quarta 19h; sábado 11h (conjunta Infantil/Preparatório) |
| Preparatório | Terça e quinta 20h (Ponta); sábado 11h (mesma turma conjunta); Ponta 2º ano sem dia/horário confirmado |

## Fonte e pendências
A planilha Ballet Joyce - Controle Pagamento2026(2).xlsx não foi encontrada no projeto nem nas pastas pesquisadas de Documents/Downloads. Caminho solicitado ao usuário. Implementação baseada exclusivamente nos horários transcritos pelo usuário no SITE-JOYCE-005C, atribuídos à aba NOVEMBRO/coluna TURMA.
Conferência direta do XLSX e comparação nominal com seus dados pessoais NÃO realizadas. Nenhum dado da planilha foi lido ou importado. Teste confirma estrutura mínima dos horários, ausência de campos financeiros/pessoais na grade e ausência de planilhas exportadas em src/public/dist; não pretende comprovar comparação com um arquivo indisponível.
PONTA mapeada para Preparatório; registro “2ª ANO-PONTA 2026” permanece sem horário. Nenhuma duração, vaga, docente, matrícula ou quantidade de turmas inferida. Faixas etárias e divergência 4–17 anos continuam pendentes. A grade não promete validade nos próximos anos.

## Arquivos
Criados: public/images/hero-joyce-helena.png, src/brand-schedules.css, tests/hero-schedules.spec.ts, este relatório.
Modificados: src/content.ts, src/HomeHighlights.tsx, src/App.tsx, src/components.tsx, src/media-authorization.json, tests/institutional.spec.ts, tests/gallery.spec.ts, README.md.
Evidência local: .local/site005c-integrity.json. Backup dos fontes anteriores: .local/site005c-before.
Galerias, textos institucionais, espetáculo, contatos e Joca preservados. Hashes de código/testes da abertura e baseline DANZIA conferidos sem alterações. Sem dependências novas, publicação ou DNS.

## Validação e capturas
Comandos: npm run lint; npm run build; npm test.
Testes específicos: nova foto e SHA-256 original/public/dist, manutenção da foto anterior, logo e legibilidade, horários exatos, turma conjunta e pendência de Ponta 2º ano, dados mínimos, responsividade em 320/375/768/1024/1440 px.
Capturas .local/site005c-header-{desktop,mobile}.png, site005c-hero-{desktop,mobile}.png, site005c-horarios-{desktop,mobile}.png.
Resultado: lint aprovado; build aprovado com 23 mídias verificadas; 25 testes aprovados. As seis capturas foram conferidas visualmente. Conferência direta da planilha continua pendente.
