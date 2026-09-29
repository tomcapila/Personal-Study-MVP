import { FORM_FEEDBACK_URL, montarLink } from '../config'
import type { ItemComFonte, Recurso } from '../lib/types'

const TIPOS: Record<string, string> = {
  artigo: 'Artigo', livro: 'Livro', capitulo: 'Capítulo', legislacao: 'Legislação', jurisprudencia: 'Jurisprudência',
  video: 'Vídeo', curso: 'Curso', podcast: 'Podcast', site: 'Site', documento: 'Documento',
}
const IDIOMAS: Record<string, string> = { en: 'em inglês', es: 'em espanhol' }

export function ListaRecursos({ recursos, disciplina }: { recursos: Recurso[]; disciplina?: string }) {
  if (!recursos.length) return <p className="suave">Nenhum recurso selecionado ainda.</p>
  const ordenados = [...recursos].sort((a, b) => b.nota_curadoria - a.nota_curadoria)
  return (
    <ol className="recursos">
      {ordenados.map((r) => {
        const reportar = montarLink(FORM_FEEDBACK_URL, { disciplina, recurso: r.id, avaliacao: 'problema_recurso' })
        return (
          <li key={r.id} id={r.id}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="titulo-recurso">{r.titulo}</a>
            <div className="selos">
              <span className="selo">{TIPOS[r.tipo] ?? r.tipo}</span>
              {IDIOMAS[r.idioma] && <span className="selo destaque">{IDIOMAS[r.idioma]}</span>}
              {r.acesso_aberto && <span className="selo">acesso aberto</span>}
              {r.ano && <span className="selo">{r.ano}</span>}
              {r.duracao_min && <span className="selo">{r.duracao_min} min</span>}
              <span className="selo" title="Nota de relevância dada na curadoria">relevância {r.nota_curadoria}/3</span>
            </div>
            {r.autores?.length ? <p className="suave">{r.autores.join(', ')}</p> : null}
            <p>{r.o_que_ganha}</p>
            {reportar && (
              <a className="reportar nao-imprimir" href={reportar} target="_blank" rel="noopener noreferrer">
                reportar problema neste recurso
              </a>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function ListaComFonte({ itens }: { itens: ItemComFonte[] }) {
  return (
    <ul className="com-fonte">
      {itens.map((p) => (
        <li key={p.texto}>
          {p.texto}{' '}
          {p.rotulo === 'sugestao_geral' ? (
            <span className="selo" title="Sugestão sem fonte específica">sugestão geral</span>
          ) : (
            p.fonte_ids.map((f) => (
              <a key={f} href={`#${f}`} className="selo" onClick={(e) => { e.preventDefault(); document.getElementById(f)?.scrollIntoView() }}>
                ver fonte
              </a>
            ))
          )}
        </li>
      ))}
    </ul>
  )
}
