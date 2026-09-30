import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { MODO_DEMO } from './lib/data'
import Inicio from './pages/Inicio'
import CursoPage from './pages/Curso'
import Grade from './pages/Grade'
import DisciplinaPage from './pages/Disciplina'
import CarreiraPage from './pages/Carreira'
import { Contribuir, Privacidade, Sobre } from './pages/Institucional'

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  // A página inicial usa a largura toda; as demais mantêm a coluna de leitura de 760px.
  // Cabeçalho, aviso e rodapé seguem a mesma largura para as bordas alinharem.
  const LARGURA = pathname === '/' ? 'mx-auto w-full max-w-6xl px-4 sm:px-6' : 'mx-auto w-full max-w-[760px] px-4'

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-md"
      >
        Pular para o conteúdo
      </a>

      <header className="nao-imprimir border-b border-borda bg-white">
        <div className={`${LARGURA} flex flex-wrap items-center justify-between gap-3 py-4`}>
          <Link to="/" className="flex flex-col rounded-md leading-none no-underline" aria-label="liberTAs, página inicial">
            <span className="text-[1.75rem] tracking-tight">
              <span className="font-medium text-navy">liber</span>
              <span className="font-extrabold text-laranja">TAs</span>
            </span>
            <span className="mt-1 text-[0.8125rem] font-medium text-suave">Guia de Estudos Universitários</span>
          </Link>
          <nav className="flex items-center gap-1 text-[0.9375rem] font-semibold" aria-label="Principal">
            <Link
              to="/grade"
              className="rounded-lg border border-navy-100 px-3.5 py-2 text-navy no-underline transition-colors hover:border-laranja hover:text-laranja-escuro"
            >
              Colar grade
            </Link>
            <Link to="/sobre" className="rounded-lg px-3.5 py-2 text-navy no-underline transition-colors hover:text-laranja-escuro">
              Sobre
            </Link>
          </nav>
        </div>
      </header>

      <div className={`nao-imprimir ${LARGURA} pt-5`}>
        <div
          role="note"
          className="flex items-start gap-3 rounded-xl border border-laranja-200 bg-laranja-50 px-4 py-3 text-[0.9375rem] text-tinta"
        >
          <svg className="mt-0.5 size-5 shrink-0 text-laranja" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 5.75v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="10" cy="13.9" r="1" fill="currentColor" />
          </svg>
          <p className="m-0">
            <strong className="font-semibold text-navy">Versão de teste.</strong> As trilhas são revisadas por
            moderadores, mas podem conter erros.
            {MODO_DEMO && <strong className="font-semibold text-navy"> Modo demonstração: dados fictícios.</strong>}
          </p>
        </div>
      </div>

      <main id="conteudo" className={`${LARGURA} flex-1 ${pathname === '/' ? '' : 'pb-12'}`}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/curso/:cursoId" element={<CursoPage />} />
          <Route path="/curso/:cursoId/carreira" element={<CarreiraPage />} />
          <Route path="/grade" element={<Grade />} />
          <Route path="/disciplina/:id" element={<DisciplinaPage />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/contribuir" element={<Contribuir />} />
          <Route path="*" element={<p>Página não encontrada. <Link to="/">Voltar ao início</Link>.</p>} />
        </Routes>
      </main>

      <footer className="nao-imprimir border-t border-borda bg-white">
        <div className={`${LARGURA} flex flex-col gap-4 py-8 text-sm text-suave md:flex-row md:items-center md:justify-between`}>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-medium" aria-label="Rodapé">
            <Link to="/sobre" className="text-suave no-underline hover:text-navy hover:underline">Sobre</Link>
            <Link to="/privacidade" className="text-suave no-underline hover:text-navy hover:underline">Privacidade</Link>
            <Link to="/contribuir" className="text-suave no-underline hover:text-navy hover:underline">Como contribuir</Link>
          </nav>
          <p className="m-0 max-w-[38rem] md:text-right">
            Projeto gratuito e sem fins comerciais. Material de estudo, não substitui a orientação dos seus professores.
          </p>
        </div>
      </footer>
    </div>
  )
}
