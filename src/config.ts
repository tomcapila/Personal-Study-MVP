// Links dos formulários externos (Tally ou Google Forms).
// São públicos por natureza: nada aqui pode ser segredo.
// Use {curso}, {disciplina}, {recurso} e {avaliacao} como marcadores; o site
// substitui pelos valores já codificados para URL.
// Ex. Tally:  https://tally.so/r/SEU_ID?disciplina={disciplina}&avaliacao={avaliacao}
// Ex. Google: https://docs.google.com/forms/d/e/SEU_ID/viewform?entry.111={disciplina}&entry.222={avaliacao}
export const FORM_FEEDBACK_URL: string = import.meta.env.VITE_FORM_FEEDBACK_URL || ''
export const FORM_EMENTA_URL: string = import.meta.env.VITE_FORM_EMENTA_URL || ''
export const CONTATO: string = import.meta.env.VITE_CONTATO || ''

export function montarLink(modelo: string, valores: Record<string, string | undefined>): string | null {
  if (!modelo) return null
  return modelo.replace(/\{(\w+)\}/g, (_, chave: string) => encodeURIComponent(valores[chave] ?? ''))
}
