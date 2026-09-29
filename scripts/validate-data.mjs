// Valida os dados do site contra os JSON Schemas e aplica as regras
// que o schema sozinho não expressa (referências cruzadas e contagens).
//
// Uso: node scripts/validate-data.mjs <pasta-de-dados> [--demo]
// --demo: exige que toda URL use example.org (dados de demonstração nunca
//         podem apontar para recursos reais inventados).
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEMO_HOST = 'example.org'

export function validarPasta(pasta, { demo = false } = {}) {
  const erros = []
  const erro = (arquivo, msg) => erros.push(`${arquivo}: ${msg}`)

  const ajv = new Ajv2020({ allErrors: true, strict: false })
  addFormats(ajv)
  for (const f of readdirSync(join(raiz, 'schemas'))) {
    ajv.addSchema(JSON.parse(readFileSync(join(raiz, 'schemas', f), 'utf8')))
  }

  const ler = (arquivo, schemaId) => {
    let dados
    try {
      dados = JSON.parse(readFileSync(arquivo, 'utf8'))
    } catch (e) {
      erro(arquivo, `JSON inválido (${e.message})`)
      return null
    }
    const validar = ajv.getSchema(schemaId)
    if (!validar(dados)) {
      for (const e of validar.errors) erro(arquivo, `${e.instancePath || '/'} ${e.message}`)
    }
    return dados
  }

  const checarUrls = (arquivo, recursos) => {
    for (const r of recursos) {
      let host
      try {
        host = new URL(r.url).hostname
      } catch {
        continue // o schema já acusa
      }
      const ehDemo = host === DEMO_HOST || host.endsWith('.' + DEMO_HOST)
      if (demo && !ehDemo) erro(arquivo, `${r.id}: dados de demonstração só podem usar ${DEMO_HOST} (achei ${host})`)
      if (!demo && ehDemo) erro(arquivo, `${r.id}: URL de demonstração (${host}) em dados reais`)
    }
  }

  const checarFontes = (arquivo, itens, idsRecursos) => {
    for (const item of itens) {
      for (const f of item.fonte_ids ?? []) {
        if (!idsRecursos.has(f)) erro(arquivo, `fonte_ids cita ${f}, que não existe entre os recursos`)
      }
    }
  }

  const meta = ler(join(pasta, 'meta.json'), 'meta.schema.json')
  const cursos = ler(join(pasta, 'cursos.json'), 'cursos.schema.json')
  const indice = ler(join(pasta, 'indice.json'), 'indice.schema.json')
  if (!meta || !cursos || !indice) return erros

  // Índice
  const porId = new Map()
  for (const d of indice.disciplinas) {
    if (porId.has(d.id)) erro('indice.json', `id duplicado: ${d.id}`)
    porId.set(d.id, d)
  }

  // Trilhas
  const dirDisc = join(pasta, 'disciplinas')
  const arquivosDisc = existsSync(dirDisc) ? readdirSync(dirDisc).filter((f) => f.endsWith('.json')) : []
  const publicadas = new Set()
  for (const f of arquivosDisc) {
    const arq = join(dirDisc, f)
    const d = ler(arq, 'disciplina.schema.json')
    if (!d) continue
    const id = basename(f, '.json')
    publicadas.add(id)
    if (d.id !== id) erro(arq, `id "${d.id}" diferente do nome do arquivo`)

    const topicos = new Set()
    for (const t of d.topicos ?? []) {
      if (topicos.has(t.id)) erro(arq, `tópico duplicado: ${t.id}`)
      topicos.add(t.id)
    }
    for (const t of d.sequencia ?? []) {
      if (!topicos.has(t)) erro(arq, `sequencia cita ${t}, que não existe em topicos`)
    }

    const recursos = [...(d.leituras ?? []), ...(d.videos_cursos ?? [])]
    const idsRecursos = new Set()
    const urls = new Set()
    for (const r of recursos) {
      if (idsRecursos.has(r.id)) erro(arq, `recurso duplicado: ${r.id}`)
      idsRecursos.add(r.id)
      if (urls.has(r.url)) erro(arq, `URL repetida: ${r.url}`)
      urls.add(r.url)
      for (const t of r.topicos ?? []) {
        if (!topicos.has(t)) erro(arq, `${r.id} cita o tópico ${t}, que não existe`)
      }
    }
    checarFontes(arq, d.pratica ?? [], idsRecursos)
    checarUrls(arq, recursos)

    if (d.cursos?.includes('direito') && !d.avisos?.some((a) => /reda[çc][ãa]o vigente/i.test(a))) {
      erro(arq, 'disciplina de Direito precisa do aviso de redação vigente da legislação')
    }
    if (d.cursos?.includes('psicologia') && !d.avisos?.some((a) => /n[ãa]o substitui/i.test(a))) {
      erro(arq, 'disciplina de Psicologia precisa do aviso de que o material não substitui orientação docente, supervisão nem atendimento')
    }

    const noIndice = porId.get(id)
    if (!noIndice) {
      erro(arq, 'disciplina publicada sem entrada em indice.json')
    } else {
      if (!noIndice.disponivel) erro('indice.json', `${id} tem trilha publicada mas disponivel = false`)
      if (noIndice.nome !== d.nome) erro('indice.json', `${id}: nome difere do arquivo da trilha`)
      if (noIndice.revisado_em !== d.revisao?.data) erro('indice.json', `${id}: revisado_em difere de revisao.data da trilha`)
    }
  }
  for (const d of indice.disciplinas) {
    if (d.disponivel && !publicadas.has(d.id)) erro('indice.json', `${d.id} marcado como disponível sem arquivo em disciplinas/`)
  }

  // Carreiras
  const dirCar = join(pasta, 'carreira')
  const arquivosCar = existsSync(dirCar) ? readdirSync(dirCar).filter((f) => f.endsWith('.json')) : []
  const carreiras = new Set()
  for (const f of arquivosCar) {
    const arq = join(dirCar, f)
    const c = ler(arq, 'carreira.schema.json')
    if (!c) continue
    const id = basename(f, '.json')
    carreiras.add(id)
    if (c.curso !== id) erro(arq, `curso "${c.curso}" diferente do nome do arquivo`)
    const idsRecursos = new Set((c.recursos ?? []).map((r) => r.id))
    for (const s of c.secoes ?? []) checarFontes(arq, s.itens, idsRecursos)
    checarUrls(arq, c.recursos ?? [])
  }

  // Cursos
  const idsCursos = new Set()
  for (const c of cursos.cursos) {
    idsCursos.add(c.id)
    if (c.carreira_disponivel !== carreiras.has(c.id)) {
      erro('cursos.json', `${c.id}: carreira_disponivel não bate com a existência de carreira/${c.id}.json`)
    }
    const vistos = new Set()
    for (const s of c.semestres) {
      for (const id of s.disciplinas) {
        if (vistos.has(id)) erro('cursos.json', `${c.id}: ${id} aparece em mais de um semestre`)
        vistos.add(id)
        const d = porId.get(id)
        if (!d) erro('cursos.json', `${c.id}: ${id} não existe em indice.json`)
        else if (!d.cursos.includes(c.id)) erro('cursos.json', `${c.id}: ${id} não lista este curso em indice.json`)
      }
    }
    for (const d of indice.disciplinas) {
      if (d.cursos.includes(c.id) && !vistos.has(d.id)) erro('cursos.json', `${c.id}: ${d.id} está no índice mas em nenhum semestre`)
    }
  }
  for (const c of carreiras) {
    if (!idsCursos.has(c)) erro('cursos.json', `carreira/${c}.json sem curso correspondente`)
  }

  // Meta
  const esperado = {
    disciplinas_no_indice: indice.disciplinas.length,
    trilhas_publicadas: publicadas.size,
    carreiras_publicadas: carreiras.size,
  }
  for (const [k, v] of Object.entries(esperado)) {
    if (meta.contagens[k] !== v) erro('meta.json', `contagens.${k} = ${meta.contagens[k]}, esperado ${v}`)
  }

  return erros
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const pasta = process.argv[2]
  if (!pasta) {
    console.error('Uso: node scripts/validate-data.mjs <pasta-de-dados> [--demo]')
    process.exit(2)
  }
  const erros = validarPasta(join(process.cwd(), pasta), { demo: process.argv.includes('--demo') })
  if (erros.length) {
    console.error(`${erros.length} erro(s) em ${pasta}:`)
    for (const e of erros) console.error('  - ' + e)
    process.exit(1)
  }
  console.log(`${pasta}: OK`)
}
