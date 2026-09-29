import { Link } from 'react-router-dom'
import { Carregando } from '../components'
import { api, useDados } from '../lib/data'

export default function Inicio() {
  const cursos = useDados(api.cursos, [])
  return (
    <>
      <section className="intro">
        <h1>Trilhas de estudo por disciplina</h1>
        <p>
          Para cada disciplina, uma trilha com os conceitos centrais, uma ordem sugerida de estudo, leituras acadêmicas
          abertas, vídeos e cursos gratuitos e ligações com a prática. Todo o conteúdo passa por revisão humana antes de
          ser publicado.
        </p>
        <p className="suave">
          Esta é uma versão de teste com três cursos. Não precisa de cadastro. Sua opinião sobre cada trilha ajuda a
          decidir o que vem depois.
        </p>
      </section>
      <h2>Escolha seu curso</h2>
      <Carregando estado={cursos}>
        {(lista) => (
          <div className="cartoes">
            {lista.map((c) => (
              <Link key={c.id} to={`/curso/${c.id}`} className="cartao">
                <strong>{c.nome}</strong>
                <span>{c.descricao}</span>
              </Link>
            ))}
          </div>
        )}
      </Carregando>
      <p>
        Já tem a lista das suas disciplinas? <Link to="/grade">Cole sua grade</Link> e veja quais trilhas existem.
      </p>
    </>
  )
}
