import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Carregando } from '../components'
import { api, useDados } from '../lib/data'
import type { Curso } from '../lib/types'

const ITENS_DA_TRILHA = [
  'Os conceitos centrais',
  'Uma ordem sugerida de estudo',
  'Leituras acadêmicas abertas',
  'Vídeos e cursos gratuitos',
  'Ligações com a prática',
]

function contar(c: Curso): string {
  const n = c.semestres.reduce((t, s) => t + s.disciplinas.length, 0)
  return `${n} disciplinas`
}

// --i escalona a entrada de cada parada da trilha (ver styles.css).
const atraso = (i: number) => ({ '--i': i }) as CSSProperties

function Trilha() {
  return (
    <figure className="m-0 rounded-2xl border border-borda bg-white p-6 shadow-sm sm:p-8">
      <figcaption className="text-[0.9375rem] font-semibold text-suave">Em cada trilha</figcaption>
      <ol className="relative m-0 mt-5 list-none p-0">
        <span
          className="trilha-linha absolute top-3 bottom-3 left-[0.6875rem] w-0.5 rounded-full bg-navy-100"
          aria-hidden="true"
        />
        {ITENS_DA_TRILHA.map((item, i) => (
          <li key={item} className="trilha-parada relative flex items-center gap-4 py-2.5" style={atraso(i)}>
            <span className="size-6 shrink-0 rounded-full border-[3px] border-laranja bg-white" aria-hidden="true" />
            <span className="font-semibold text-navy">{item}</span>
          </li>
        ))}
        <li
          className="trilha-parada relative mt-2 -ml-1 flex items-center gap-4 rounded-xl bg-navy-50 py-3 pr-3 pl-1"
          style={atraso(ITENS_DA_TRILHA.length)}
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-white" aria-hidden="true">
            <svg className="size-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[0.9375rem] text-tinta">Revisada por uma pessoa antes de publicar</span>
        </li>
      </ol>
    </figure>
  )
}

export default function Inicio() {
  const cursos = useDados(api.cursos, [])
  return (
    <>
      <section className="grid items-center gap-10 py-14 md:grid-cols-[1.15fr_1fr] md:gap-14 md:py-20">
        <div>
          <h1 className="m-0 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-navy sm:text-[3.25rem] lg:text-[3.75rem]">
            Trilhas de estudo por disciplina
          </h1>
          <p className="m-0 mt-6 max-w-[34rem] text-lg leading-relaxed text-tinta">
            Para cada disciplina, uma trilha pronta para seguir, do primeiro conceito à prática. Todo o conteúdo passa
            por revisão humana antes de ser publicado.
          </p>
          <p className="m-0 mt-4 max-w-[34rem] leading-relaxed text-suave">
            Esta é uma versão de teste com três cursos. Não precisa de cadastro. Sua opinião sobre cada trilha ajuda a
            decidir o que vem depois.
          </p>
        </div>
        <Trilha />
      </section>

      <section aria-labelledby="titulo-cursos" className="pb-16">
        <h2 id="titulo-cursos" className="m-0 text-2xl font-bold tracking-tight text-navy">Escolha seu curso</h2>
        <div className="mt-6">
          <Carregando estado={cursos}>
            {(lista) => (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {lista.map((c) => (
                  <Link
                    key={c.id}
                    to={`/curso/${c.id}`}
                    className="group flex flex-col rounded-2xl border border-borda bg-white p-6 no-underline shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:border-laranja hover:shadow-md motion-safe:hover:-translate-y-0.5"
                  >
                    <strong className="text-xl font-bold text-navy">{c.nome}</strong>
                    <span className="mt-2 leading-relaxed text-suave">{c.descricao}</span>
                    <span className="mt-auto self-start pt-6">
                      <span className="block rounded-full bg-navy-50 px-3 py-1 text-sm font-semibold text-navy transition-colors group-hover:bg-laranja-50 group-hover:text-laranja-escuro">
                        {contar(c)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Carregando>
        </div>
      </section>

      <section className="mb-16 flex flex-col gap-6 rounded-3xl bg-navy px-6 py-8 text-white sm:px-10 sm:py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="m-0 text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">
            Já tem a lista das suas disciplinas?
          </h2>
          <p className="m-0 mt-2 text-lg text-navy-100">Cole sua grade e veja quais trilhas existem.</p>
        </div>
        {/* 19px em negrito conta como texto grande na WCAG: branco sobre #E85F10 (3,4:1) passa no AA. */}
        <Link
          to="/grade"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-laranja px-6 py-3.5 text-[1.1875rem] font-bold text-white no-underline shadow-sm transition-colors hover:bg-laranja-escuro hover:text-white focus-visible:outline-white"
        >
          Colar minha grade
        </Link>
      </section>
    </>
  )
}
