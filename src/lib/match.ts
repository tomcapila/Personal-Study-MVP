import Fuse from 'fuse.js'
import type { CursoId, ItemIndice } from './types'

const ROMANOS: Record<string, string> = { i: '1', ii: '2', iii: '3', iv: '4', v: '5', vi: '6', vii: '7', viii: '8' }

/** Normaliza um nome de disciplina para comparação. */
export function normalizar(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // "(60h)", "(obrigatória)"
    .replace(/^\s*(?:[a-z]{2,4}\s*-\s*)?[a-z]{2,5}[-\s]?\d{2,5}\s*[-–:]?\s*/, '') // código: "ADM101 - ", "DCV0115 ", "DIG - CAD152 - "
    .replace(/\s+(obrigatoria|optativa|eletiva)\b.*$/, '') // "Obrigatória 4 60 0"
    .replace(/(\s+\d+){2,}\s*$/, '') // créditos e carga horária no fim: "4 0 60"
    .replace(/\b\d+\s*h(oras)?\b/g, ' ') // carga horária solta
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((p) => ROMANOS[p] ?? p)
    .join(' ')
}

/** Separa o texto colado em uma disciplina por linha, sem vazias nem repetidas. */
export function separarLinhas(texto: string): string[] {
  const vistas = new Set<string>()
  const linhas: string[] = []
  for (const bruta of texto.split(/\r?\n/)) {
    const linha = bruta.replace(/^[\s•\-*\d.)]+(?=\p{L})/u, '').trim()
    const chave = normalizar(linha)
    if (!chave || vistas.has(chave)) continue
    vistas.add(chave)
    linhas.push(linha)
  }
  return linhas
}

export type Confianca = 'exata' | 'alta' | 'media'

export interface Correspondencia {
  entrada: string
  item: ItemIndice | null
  confianca: Confianca | null
  /** Score do Fuse: 0 é idêntico, 1 é nada a ver. */
  score: number | null
}

interface Nome {
  item: ItemIndice
  norm: string
}

export function criarBuscador(indice: ItemIndice[], curso?: CursoId) {
  const nomes: Nome[] = indice.flatMap((item) =>
    [item.nome, ...item.sinonimos].map((n) => ({ item, norm: normalizar(n) })),
  )
  const exatos = new Map<string, ItemIndice[]>()
  for (const n of nomes) exatos.set(n.norm, [...(exatos.get(n.norm) ?? []), n.item])
  const fuse = new Fuse(nomes, { keys: ['norm'], includeScore: true, threshold: 0.4, ignoreLocation: true })

  // Em empate, prefere disciplina do curso escolhido.
  const preferir = (itens: ItemIndice[]) =>
    (curso && itens.find((i) => i.cursos.includes(curso))) || itens[0]

  return function corresponder(entrada: string): Correspondencia {
    const norm = normalizar(entrada)
    const exato = exatos.get(norm)
    if (exato) return { entrada, item: preferir(exato), confianca: 'exata', score: 0 }

    const resultados = fuse.search(norm, { limit: 5 })
    if (!resultados.length) return { entrada, item: null, confianca: null, score: null }
    const melhor = resultados[0].score ?? 1
    const empatados = resultados.filter((r) => (r.score ?? 1) - melhor < 0.02).map((r) => r.item.item)
    const item = preferir(empatados)
    const confianca: Confianca | null = melhor <= 0.15 ? 'alta' : melhor <= 0.35 ? 'media' : null
    if (!confianca) return { entrada, item: null, confianca: null, score: melhor }
    return { entrada, item, confianca, score: melhor }
  }
}
