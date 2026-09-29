import { useEffect, useState } from 'react'
import type { Carreira, Curso, Disciplina, ItemIndice, Meta } from './types'

export const DATA_DIR: string = import.meta.env.VITE_DATA_DIR || 'data'
export const MODO_DEMO = DATA_DIR !== 'data'

const cache = new Map<string, Promise<unknown>>()

function carregar<T>(caminho: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}${DATA_DIR}/${caminho}`
  let p = cache.get(url)
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${r.status} ao carregar ${caminho}`)
      return r.json()
    })
    p.catch(() => cache.delete(url))
    cache.set(url, p)
  }
  return p as Promise<T>
}

export const api = {
  meta: () => carregar<Meta>('meta.json'),
  cursos: () => carregar<{ cursos: Curso[] }>('cursos.json').then((d) => d.cursos),
  indice: () => carregar<{ disciplinas: ItemIndice[] }>('indice.json').then((d) => d.disciplinas),
  disciplina: (id: string) => carregar<Disciplina>(`disciplinas/${encodeURIComponent(id)}.json`),
  carreira: (curso: string) => carregar<Carreira>(`carreira/${encodeURIComponent(curso)}.json`),
}

export type Estado<T> = { status: 'carregando' } | { status: 'erro'; erro: string } | { status: 'ok'; dados: T }

export function useDados<T>(fn: () => Promise<T>, deps: unknown[]): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({ status: 'carregando' })
  useEffect(() => {
    let vivo = true
    setEstado({ status: 'carregando' })
    fn().then(
      (dados) => vivo && setEstado({ status: 'ok', dados }),
      (e: Error) => vivo && setEstado({ status: 'erro', erro: e.message }),
    )
    return () => {
      vivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return estado
}
