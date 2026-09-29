import { Link, useParams } from 'react-router-dom'
import { Avisos, Carregando, formatarData } from '../components'
import { FORM_EMENTA_URL, FORM_FEEDBACK_URL, montarLink } from '../config'
import { api, useDados } from '../lib/data'
import type { Disciplina, ItemIndice } from '../lib/types'
import { ListaComFonte, ListaRecursos } from './Recursos'

export default function DisciplinaPage() {
  const { id = '' } = useParams()
  const indice = useDados(api.indice, [])
  return (
    <Carregando estado={indice}>
      {(lista) => {
        const item = lista.find((d) => d.id === id)
        if (!item) return <p>Disciplina não encontrada. <Link to="/grade">Procurar pelo nome</Link>.</p>
        if (!item.disponivel) return <EmPreparacao item={item} />
        return <Trilha id={id} />
      }}
    </Carregando>
  )
}

function EmPreparacao({ item }: { item: ItemIndice }) {
  const link = montarLink(FORM_EMENTA_URL, { curso: item.cursos[0], disciplina: item.nome })
  return (
    <>
      <p className="migalha"><Link to={`/curso/${item.cursos[0]}`}>Voltar ao curso</Link></p>
      <h1>{item.nome}</h1>
      <p>A trilha desta disciplina ainda está sendo preparada e revisada.</p>
      {link && (
        <p>
          Tem a ementa da sua instituição? <a href={link} target="_blank" rel="noopener noreferrer">Envie aqui</a>. Ela
          ajuda a montar a trilha.
        </p>
      )}
    </>
  )
}

function Trilha({ id }: { id: string }) {
  const trilha = useDados(() => api.disciplina(id), [id])
  return <Carregando estado={trilha}>{(d) => <Conteudo d={d} />}</Carregando>
}

function Conteudo({ d }: { d: Disciplina }) {
  const rotulos = new Map(d.topicos.map((t) => [t.id, t.rotulo]))
  const util = montarLink(FORM_FEEDBACK_URL, { disciplina: d.id, avaliacao: 'util' })
  const naoUtil = montarLink(FORM_FEEDBACK_URL, { disciplina: d.id, avaliacao: 'nao_util' })
  return (
    <article className="trilha">
      <p className="migalha nao-imprimir"><Link to={`/curso/${d.cursos[0]}`}>Voltar ao curso</Link></p>
      <h1>{d.nome}</h1>
      <p className="suave">
        Semestre típico: {d.semestre_tipico}º
        {d.origem_topicos === 'inferido' && ' · Tópicos inferidos a partir de grades públicas, confira com a sua ementa.'}
      </p>
      <Avisos avisos={d.avisos} />
      <button className="botao secundario nao-imprimir" onClick={() => window.print()}>Imprimir ou salvar em PDF</button>

      <h2>Conceitos centrais</h2>
      <dl className="conceitos">
        {d.conceitos.map((c) => (
          <div key={c.nome}>
            <dt>{c.nome}</dt>
            <dd>{c.por_que_importa}</dd>
          </div>
        ))}
      </dl>

      <h2>Sequência sugerida</h2>
      <ol>
        {d.sequencia.map((t) => <li key={t}>{rotulos.get(t)}</li>)}
      </ol>

      <h2>Leituras</h2>
      <ListaRecursos recursos={d.leituras} disciplina={d.id} />

      <h2>Vídeos e cursos gratuitos</h2>
      <ListaRecursos recursos={d.videos_cursos} disciplina={d.id} />

      {d.pratica.length > 0 && (
        <>
          <h2>Conexão com a prática</h2>
          <ListaComFonte itens={d.pratica} />
        </>
      )}

      {d.lacunas.length > 0 && (
        <>
          <h2>Lacunas</h2>
          <p className="suave">Pontos em que não encontramos material gratuito de boa qualidade.</p>
          <ul>{d.lacunas.map((l) => <li key={l}>{l}</li>)}</ul>
        </>
      )}

      <footer className="rodape-trilha">
        <p>Revisado em {formatarData(d.revisao.data)} · gerado em {formatarData(d.gerado_em)} · pipeline {d.versao_pipeline}</p>
        {util && naoUtil && (
          <div className="avaliar nao-imprimir">
            <span>Esta trilha foi útil?</span>
            <a className="botao" href={util} target="_blank" rel="noopener noreferrer">Útil</a>
            <a className="botao secundario" href={naoUtil} target="_blank" rel="noopener noreferrer">Não útil</a>
          </div>
        )}
      </footer>
    </article>
  )
}
