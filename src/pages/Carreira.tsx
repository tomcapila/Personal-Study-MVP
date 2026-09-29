import { Link, useParams } from 'react-router-dom'
import { Avisos, Carregando, formatarData } from '../components'
import { api, useDados } from '../lib/data'
import { ListaComFonte, ListaRecursos } from './Recursos'

export default function CarreiraPage() {
  const { cursoId = '' } = useParams()
  const dados = useDados(() => Promise.all([api.cursos(), api.carreira(cursoId).catch(() => null)]), [cursoId])
  return (
    <Carregando estado={dados}>
      {([cursos, c]) => {
        const curso = cursos.find((x) => x.id === cursoId)
        if (!curso) return <p>Curso não encontrado.</p>
        if (!c) return <p>A página de carreira de {curso.nome} ainda está em preparação. <Link to={`/curso/${curso.id}`}>Voltar</Link>.</p>
        return (
          <article>
            <p className="migalha nao-imprimir"><Link to={`/curso/${curso.id}`}>Voltar ao curso</Link></p>
            <h1>Carreira em {curso.nome}</h1>
            <Avisos avisos={[...curso.avisos, ...c.avisos]} />
            <p>{c.resumo}</p>
            {c.secoes.map((s) => (
              <section key={s.titulo}>
                <h2>{s.titulo}</h2>
                <ListaComFonte itens={s.itens} />
              </section>
            ))}
            <h2>Fontes</h2>
            <ListaRecursos recursos={c.recursos} />
            <p className="suave">Revisado em {formatarData(c.revisao.data)}</p>
          </article>
        )
      }}
    </Carregando>
  )
}
