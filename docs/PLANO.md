# Plano de execução do MVP

Base: `mvp_github_pages.md` v0.1 (29/09/2026). Este arquivo acompanha o que já foi feito e o que falta.

## Decisões de implementação

| Decisão | Motivo |
|---|---|
| Este repositório (público) é o **site** | O Pages gratuito exige repositório público. O pipeline, as ementas e as chaves vão para um repositório privado à parte |
| Base do Vite relativa (`./`) com `HashRouter` | Funciona em `usuario.github.io/<repo>/` sem depender do nome do repositório |
| Campo `disponivel` no `indice.json` | O catálogo pode listar disciplinas antes de a trilha ser aprovada; o site mostra "em preparação" e oferece envio de ementa |
| Regras extras no validador (avisos de Direito e Psicologia, `example.org`) | Transformam itens do checklist de moderação em checagem automática |
| Dados de demonstração separados (`public/demo-data`) | Permitem testar layout sem publicar conteúdo inventado. São removidos do build |
| Formulários configurados por variável do repositório | Tally ou Google Forms podem ser trocados sem mexer no código |

## Andamento pelo roadmap

| Semana | Entrega | Situação |
|---|---|---|
| 1 | Coletar PPCs, matriz canônica inicial, golden set, lista de domínios, chaves de API | **Pendente (manual).** Catálogo semente com 9 disciplinas do piloto em `public/data`; nomes, sinônimos e semestres são estimativas a substituir pela etapa E3 |
| 2 | Pipeline E1 a E6 | **Código pronto e testado** (sem chamadas reais), no repositório privado `study-assistant-pipeline` |
| 3 | Pipeline E7 a E10, piloto com 9 disciplinas | **Código pronto e testado** (sem chamadas reais). A exportação passou no validador deste site. Falta o piloto real |
| 4 | Site: telas, schema, workflows, deploy | **Feito**, faltando a primeira publicação com trilhas reais |
| 5 | Geração completa e moderação | Pendente |
| 6 | Lançamento | Pendente |

### Feito no site

- Telas: início, curso por semestre, colar grade com correspondência aproximada e confirmação, trilha, carreira, sobre, privacidade, como contribuir.
- Busca no navegador: normaliza acentos, códigos de disciplina, carga horária e números romanos; mostra o grau de confiança; nada é enviado a servidor.
- Botões "útil" / "não útil" por trilha e "reportar problema" por recurso, abrindo o formulário já preenchido.
- CSS de impressão (mostra a URL de cada recurso no PDF), layout para celular, tema escuro.
- JSON Schemas e validador com as regras da seção 7.
- Workflows `validate.yml`, `links.yml` (PR e mensal, abre issue) e `deploy.yml`.
- Template de PR com o checklist da moderação.

## Próximos passos que dependem de você

1. Ativar o Pages com source "GitHub Actions" e proteger a `main` (ver README).
2. Criar os formulários de ementa e de avaliação (Tally ou Google Forms) e cadastrar os links como variáveis do repositório.
3. Definir um contato para pedidos de exclusão (variável `CONTATO`).
4. Criar a branch `main` deste repositório (merge da branch de trabalho), que é a base dos PRs do pipeline.
5. Criar as chaves de API (Claude, OpenAlex, Semantic Scholar, YouTube, Tavily), guardadas só no `.env` local do pipeline.
6. Coletar de 3 a 5 PPCs por curso e escolher o golden set (5 disciplinas por curso).

## A conferir

- Versões das actions usadas nos workflows (`checkout@v5`, `setup-node@v5`, `upload-pages-artifact@v4`, `deploy-pages@v4`, `configure-pages@v5`, `lychee-action@v2`, `create-issue-from-file@v5`). Escolhi as que conheço; pode haver versões mais novas.
- Sites de governo e tribunais às vezes bloqueiam robôs e retornam 403 na checagem de links. Se isso acontecer, avaliar exceções pontuais em vez de aceitar 403 para todos.
- Cotas de Actions e condições do plano gratuito (seção 15 do documento base).
