import { Link, useParams } from 'react-router-dom'
import { Avisos, Carregando } from '../components'
import { api, useDados } from '../lib/data'
import type { Curso, ItemIndice } from '../lib/types'

export default function CursoPage() {
  const { cursoId = '' } = useParams()
  const dados = useDados(() => Promise.all([api.cursos(), api.indice()]), [])
  return (
    <Carregando estado={dados}>
      {([cursos, indice]) => {
        const curso = cursos.find((c) => c.id === cursoId)
        if (!curso) return <p>Curso não encontrado. <Link to="/">Voltar ao início</Link>.</p>
        return <Conteudo curso={curso} indice={indice} />
      }}
    </Carregando>
  )
}

function Conteudo({ curso, indice }: { curso: Curso; indice: ItemIndice[] }) {
  const porId = new Map(indice.map((d) => [d.id, d]))
  const total = curso.semestres.reduce((n, s) => n + s.disciplinas.length, 0)
  const prontas = curso.semestres.flatMap((s) => s.disciplinas).filter((id) => porId.get(id)?.disponivel).length
  return (
    <>
      <p className="migalha"><Link to="/">Início</Link> › {curso.nome}</p>
      <h1>{curso.nome}</h1>
      <Avisos avisos={curso.avisos} />
      <div className="acoes">
        <Link className="botao" to={`/grade?curso=${curso.id}`}>Colar minha grade</Link>
        {curso.carreira_disponivel && (
          <Link className="botao secundario" to={`/curso/${curso.id}/carreira`}>Carreira em {curso.nome}</Link>
        )}
      </div>
      <p className="suave">
        {prontas} de {total} disciplinas com trilha publicada. O semestre é o típico entre as grades consultadas; o da
        sua instituição pode ser outro.
      </p>
      {curso.semestres.map((s) => (
        <section key={s.semestre} className="semestre">
          <h2>{s.semestre}º semestre</h2>
          <ul className="lista-disciplinas">
            {s.disciplinas.map((id) => {
              const d = porId.get(id)
              if (!d) return null
              return (
                <li key={id}>
                  <Link to={`/disciplina/${id}`}>{d.nome}</Link>
                  {d.disponivel ? null : <span className="selo">em preparação</span>}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </>
  )
}
