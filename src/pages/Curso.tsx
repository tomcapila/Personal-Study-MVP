import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avisos, Carregando } from '../components'
import { api, useDados } from '../lib/data'
import { normalizar } from '../lib/match'
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
  const [filtro, setFiltro] = useState('')
  const porId = new Map(indice.map((d) => [d.id, d]))
  const total = curso.semestres.reduce((n, s) => n + s.disciplinas.length, 0)
  const prontas = curso.semestres.flatMap((s) => s.disciplinas).filter((id) => porId.get(id)?.disponivel).length
  // O filtro olha o nome e os sinônimos, então "TGP" ou "Processo Civil" também acham a disciplina.
  const termo = normalizar(filtro)
  const passa = (d: ItemIndice) => !termo || [d.nome, ...d.sinonimos].some((n) => normalizar(n).includes(termo))
  const semestres = curso.semestres
    .map((s) => ({ ...s, itens: s.disciplinas.map((id) => porId.get(id)).filter((d): d is ItemIndice => !!d && passa(d)) }))
    .filter((s) => s.itens.length)
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
        {total} disciplinas obrigatórias comuns às grades consultadas
        {prontas ? `, ${prontas} com trilha publicada` : '. As trilhas ainda estão em preparação'}. O semestre é o
        típico entre as grades; o da sua instituição pode ser outro.
      </p>
      <label className="campo filtro">
        Filtrar disciplinas
        <input
          type="search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Nome ou apelido, como TGP"
        />
      </label>
      {semestres.length === 0 && (
        <p className="suave">
          Nenhuma disciplina com esse nome. Tente <Link to={`/grade?curso=${curso.id}`}>colar sua grade</Link>, que
          aceita variações.
        </p>
      )}
      <div className="semestres">
        {semestres.map((s) => (
          <section key={s.semestre} className="semestre">
            <h2>{s.semestre}º semestre</h2>
            <ul className="lista-disciplinas">
              {s.itens.map((d) => (
                <li key={d.id} className={d.disponivel ? undefined : 'em-preparacao'}>
                  <Link to={`/disciplina/${d.id}`}>{d.nome}</Link>
                  {d.disponivel && <span className="selo destaque">trilha pronta</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
