import { describe, expect, it } from 'vitest'
import { criarBuscador, normalizar, separarLinhas } from './match'
import type { ItemIndice } from './types'

const indice: ItemIndice[] = [
  { id: 'direito-constitucional-1', nome: 'Direito Constitucional I', sinonimos: ['Teoria da Constituição'], cursos: ['direito'], semestre_tipico: 2, disponivel: true },
  { id: 'direito-civil-1', nome: 'Direito Civil I', sinonimos: ['Direito Civil: Parte Geral'], cursos: ['direito'], semestre_tipico: 2, disponivel: false },
  { id: 'teoria-geral-da-administracao', nome: 'Teoria Geral da Administração', sinonimos: ['TGA'], cursos: ['administracao'], semestre_tipico: 1, disponivel: false },
  { id: 'psicopatologia-1', nome: 'Psicopatologia I', sinonimos: ['Psicopatologia Geral'], cursos: ['psicologia'], semestre_tipico: 5, disponivel: false },
]

describe('normalizar', () => {
  it('remove acentos, códigos, carga horária e converte romanos', () => {
    expect(normalizar('DIR201 - Direito Constitucional I (60h)')).toBe('direito constitucional 1')
    expect(normalizar('Teoria Geral da Administração')).toBe('teoria geral da administracao')
    expect(normalizar('Psicopatologia II 80 horas')).toBe('psicopatologia 2')
  })
})

describe('separarLinhas', () => {
  it('ignora vazias, marcadores e repetidas', () => {
    expect(separarLinhas('• Direito Civil I\n\n1. Direito Civil I\n- TGA\n')).toEqual(['Direito Civil I', 'TGA'])
  })
})

describe('criarBuscador', () => {
  const buscar = criarBuscador(indice)
  it('casa nome exato e sinônimo', () => {
    expect(buscar('direito constitucional 1').item?.id).toBe('direito-constitucional-1')
    expect(buscar('Direito Constitucional 1').confianca).toBe('exata')
    expect(buscar('Teoria da Constituicao').item?.id).toBe('direito-constitucional-1')
    expect(buscar('ADM1001 - TGA').item?.id).toBe('teoria-geral-da-administracao')
  })
  it('casa variações próximas', () => {
    const r = buscar('Teoria Geral de Administração')
    expect(r.item?.id).toBe('teoria-geral-da-administracao')
    expect(r.confianca).not.toBe('exata')
  })
  it('não inventa correspondência', () => {
    expect(buscar('Cálculo Diferencial e Integral III').item).toBeNull()
    expect(buscar('Neuroanatomia').item).toBeNull()
  })
})
