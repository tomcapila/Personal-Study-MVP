import type { ReactNode } from 'react'
import type { Estado } from './lib/data'

export function Carregando<T>({ estado, children }: { estado: Estado<T>; children: (dados: T) => ReactNode }) {
  if (estado.status === 'carregando') return <p className="suave">Carregando…</p>
  if (estado.status === 'erro') return <p className="erro">Não foi possível carregar os dados ({estado.erro}).</p>
  return <>{children(estado.dados)}</>
}

export function Avisos({ avisos }: { avisos: string[] }) {
  if (!avisos.length) return null
  return (
    <div className="avisos" role="note">
      {avisos.map((a) => (
        <p key={a}>{a}</p>
      ))}
    </div>
  )
}

export function formatarData(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
