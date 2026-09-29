# Personal Study Assistant (site do MVP)

Site estático com trilhas de estudo por disciplina para Administração, Direito e Psicologia. Versão de teste, gratuita e sem login, publicada no GitHub Pages.

Este repositório é público e contém só o site e os dados já aprovados. O pipeline que gera as trilhas, as ementas recebidas e as chaves de API ficam num repositório privado separado. **Nenhuma chave de API entra aqui**: tudo que está neste repositório vai para o navegador de qualquer pessoa.

## Rodar localmente

```bash
npm install
npm run dev        # usa public/data (catálogo real)
npm run dev:demo   # usa public/demo-data (dados fictícios, só para layout)
npm run validate   # confere os dados contra os schemas
npm test
npm run build
```

## Estrutura

```text
public/data/          dados publicados (gerados pelo pipeline, entram por PR)
  meta.json           versão e contagens do catálogo
  cursos.json         cursos e disciplinas por semestre típico
  indice.json         nomes e sinônimos, alimenta a busca aproximada
  disciplinas/{id}.json   trilha aprovada de cada disciplina
  carreira/{curso}.json   página de carreira de cada curso
public/demo-data/     dados fictícios (URLs example.org), removidos do build
schemas/              JSON Schema de cada tipo de arquivo
scripts/              validação dos dados e ajustes do build
src/                  app React (Vite + TypeScript, HashRouter, Fuse.js)
.github/workflows/    validate, links, deploy
```

## Regras dos dados

Conferidas por `scripts/validate-data.mjs` em todo PR:

- toda trilha publicada tem `revisao.status = "aprovado"`;
- todo recurso tem `url` (https), `titulo` e `tipo`;
- item de prática ou carreira sem `fonte_ids` precisa do rótulo `sugestao_geral`, e com fonte precisa de `com_fonte`;
- IDs em `sequencia` existem em `topicos`, e `fonte_ids` apontam para recursos da própria trilha;
- trilhas de Direito têm o aviso de redação vigente; trilhas de Psicologia têm o aviso de que não substituem orientação docente, supervisão nem atendimento;
- índice, cursos, arquivos e `meta.json` batem entre si;
- dados reais não podem usar `example.org`, e dados de demonstração só podem usar `example.org`.

## Publicação

O deploy roda a cada merge na `main`. Configuração única no GitHub:

1. Settings > Pages > Source: **GitHub Actions**.
2. Settings > Secrets and variables > Actions > **Variables**: `FORM_FEEDBACK_URL`, `FORM_EMENTA_URL` e `CONTATO`. São links públicos, não segredos. Os links aceitam os marcadores `{curso}`, `{disciplina}`, `{recurso}` e `{avaliacao}`, que o site preenche.
3. Settings > Branches: proteger a `main` exigindo PR aprovado e os checks `validate` e `links`.

Veja `docs/PLANO.md` para o andamento do MVP.
