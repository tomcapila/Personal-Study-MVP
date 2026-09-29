import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Carregando } from '../components'
import { FORM_EMENTA_URL, montarLink } from '../config'
import { api, useDados } from '../lib/data'
import { criarBuscador, separarLinhas, type Correspondencia } from '../lib/match'
import type { Curso, CursoId, ItemIndice } from '../lib/types'

const ROTULO_CONFIANCA = { exata: 'nome igual', alta: 'muito parecido', media: 'confira' } as const

export default function Grade() {
  const dados = useDados(() => Promise.all([api.cursos(), api.indice()]), [])
  return (
    <Carregando estado={dados}>{([cursos, indice]) => <Conteudo cursos={cursos} indice={indice} />}</Carregando>
  )
}

function Conteudo({ cursos, indice }: { cursos: Curso[]; indice: ItemIndice[] }) {
  const [params, setParams] = useSearchParams()
  const curso = (params.get('curso') as CursoId | null) ?? undefined
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState<Correspondencia[] | null>(null)
  // Chave: índice da linha. Valor: se o aluno confirmou a correspondência.
  const [confirmadas, setConfirmadas] = useState<Record<number, boolean>>({})

  const buscar = useMemo(() => criarBuscador(indice, curso), [indice, curso])

  function processar() {
    const r = separarLinhas(texto).map(buscar)
    setResultado(r)
    setConfirmadas(Object.fromEntries(r.map((c, i) => [i, c.confianca === 'exata' || c.confianca === 'alta'])))
  }

  const encontradas = resultado?.map((c, i) => ({ c, i })).filter(({ c }) => c.item) ?? []
  const naoEncontradas = resultado?.filter((c) => !c.item) ?? []
  const escolhidas = new Map<string, ItemIndice>()
  for (const { c, i } of encontradas) if (confirmadas[i] && c.item) escolhidas.set(c.item.id, c.item)

  return (
    <>
      <h1>Cole sua grade</h1>
      <p>Uma disciplina por linha. Pode colar direto do portal da faculdade: códigos e carga horária são ignorados.</p>
      <p className="suave">A correspondência é feita no seu navegador. O texto não é enviado a lugar nenhum.</p>
      <label className="campo">
        Curso
        <select
          value={curso ?? ''}
          onChange={(e) => setParams(e.target.value ? { curso: e.target.value } : {}, { replace: true })}
        >
          <option value="">Qualquer curso</option>
          {cursos.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </label>
      <label className="campo">
        Disciplinas
        <textarea
          rows={8}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={'Direito Constitucional I\nTeoria Geral do Direito Civil\n...'}
        />
      </label>
      <button className="botao" onClick={processar} disabled={!texto.trim()}>Procurar trilhas</button>

      {resultado && (
        <>
          <h2>Encontradas ({encontradas.length})</h2>
          {encontradas.length === 0 && <p className="suave">Nenhuma correspondência.</p>}
          <ul className="correspondencias">
            {encontradas.map(({ c, i }) => (
              <li key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={!!confirmadas[i]}
                    onChange={(e) => setConfirmadas({ ...confirmadas, [i]: e.target.checked })}
                  />
                  <span>
                    <span className="entrada">{c.entrada}</span> → <strong>{c.item!.nome}</strong>{' '}
                    <span className={`confianca ${c.confianca}`}>{ROTULO_CONFIANCA[c.confianca!]}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {escolhidas.size > 0 && (
            <>
              <h2>Suas trilhas</h2>
              <ul className="lista-disciplinas">
                {[...escolhidas.values()].map((d) => (
                  <li key={d.id}>
                    <Link to={`/disciplina/${d.id}`}>{d.nome}</Link>
                    {!d.disponivel && <span className="selo">em preparação</span>}
                  </li>
                ))}
              </ul>
            </>
          )}

          {naoEncontradas.length > 0 && (
            <>
              <h2>Não encontradas ({naoEncontradas.length})</h2>
              <p>
                Essas disciplinas ainda não estão no catálogo. Se puder, envie a ementa: ela ajuda a incluir a
                disciplina e melhorar a busca.
              </p>
              <ul className="nao-encontradas">
                {naoEncontradas.map((c) => {
                  const link = montarLink(FORM_EMENTA_URL, { curso, disciplina: c.entrada })
                  return (
                    <li key={c.entrada}>
                      {c.entrada}{' '}
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer">enviar ementa</a>
                      ) : (
                        <span className="suave">(formulário em configuração)</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </>
      )}
    </>
  )
}
