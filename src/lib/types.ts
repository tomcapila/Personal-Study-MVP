export type CursoId = 'administracao' | 'direito' | 'psicologia'

export interface Meta {
  versao_catalogo: string
  gerado_em: string
  versao_pipeline: string
  observacao?: string
  contagens: { disciplinas_no_indice: number; trilhas_publicadas: number; carreiras_publicadas: number }
}

export interface Curso {
  id: CursoId
  nome: string
  descricao: string
  avisos: string[]
  carreira_disponivel: boolean
  semestres: { semestre: number; disciplinas: string[] }[]
}

export interface ItemIndice {
  id: string
  nome: string
  sinonimos: string[]
  cursos: CursoId[]
  semestre_tipico: number
  disponivel: boolean
  revisado_em?: string
}

export interface Recurso {
  id: string
  titulo: string
  url: string
  tipo: string
  idioma: 'pt' | 'en' | 'es'
  autores?: string[]
  ano?: number
  doi?: string
  acesso_aberto?: boolean
  duracao_min?: number
  topicos?: string[]
  nota_curadoria: number
  o_que_ganha: string
}

export interface ItemComFonte {
  texto: string
  fonte_ids: string[]
  rotulo: 'com_fonte' | 'sugestao_geral'
}

export interface Revisao {
  status: 'aprovado'
  moderador: string
  data: string
}

export interface Disciplina {
  id: string
  nome: string
  sinonimos: string[]
  cursos: CursoId[]
  semestre_tipico: number
  origem_topicos: 'ementa' | 'ppc' | 'inferido'
  topicos: { id: string; rotulo: string }[]
  conceitos: { nome: string; por_que_importa: string }[]
  sequencia: string[]
  leituras: Recurso[]
  videos_cursos: Recurso[]
  pratica: ItemComFonte[]
  lacunas: string[]
  avisos: string[]
  revisao: Revisao
  gerado_em: string
  versao_pipeline: string
}

export interface Carreira {
  curso: CursoId
  resumo: string
  secoes: { titulo: string; itens: ItemComFonte[] }[]
  recursos: Recurso[]
  avisos: string[]
  revisao: Revisao
  gerado_em: string
  versao_pipeline: string
}
