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

  return (
    <>
      <header className="topo">
        <div className="container topo-linha">
          <Link to="/" className="marca">Personal Study Assistant</Link>
          <nav>
            <Link to="/grade">Colar grade</Link>
            <Link to="/sobre">Sobre</Link>
          </nav>
        </div>
      </header>
      <div className="faixa-teste">
        <div className="container">
          Versão de teste. As trilhas são revisadas por moderadores, mas podem conter erros.
          {MODO_DEMO && <strong> Modo demonstração: dados fictícios.</strong>}
        </div>
      </div>
      <main className="container">
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
      <footer className="rodape">
        <div className="container">
          <Link to="/sobre">Sobre</Link> · <Link to="/privacidade">Privacidade</Link> ·{' '}
          <Link to="/contribuir">Como contribuir</Link>
          <p>Projeto gratuito e sem fins comerciais. Material de estudo, não substitui a orientação dos seus professores.</p>
        </div>
      </footer>
    </>
  )
}
