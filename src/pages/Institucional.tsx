import { Carregando, formatarData } from '../components'
import { CONTATO, FORM_EMENTA_URL, FORM_FEEDBACK_URL } from '../config'
import { api, useDados } from '../lib/data'

export function Sobre() {
  const meta = useDados(api.meta, [])
  return (
    <article>
      <h1>Sobre o projeto</h1>
      <p>
        O Personal Study Assistant monta trilhas de estudo por disciplina para alunos de graduação. Nesta versão de teste
        o catálogo cobre Administração, Direito e Psicologia.
      </p>
      <h2>Como as trilhas são feitas</h2>
      <ol>
        <li>Reunimos grades e ementas públicas de algumas universidades e as ementas enviadas por alunos.</li>
        <li>Um modelo de linguagem extrai os tópicos e planeja buscas.</li>
        <li>Os recursos vêm de bases abertas (como OpenAlex, Semantic Scholar, SciELO) e de vídeos e cursos gratuitos. O modelo nunca escreve links: todo link vem de uma busca real e é verificado.</li>
        <li>Um moderador revisa cada trilha antes de publicar.</li>
        <li>Uma checagem automática confere os links todo mês.</li>
      </ol>
      <p>
        Mesmo com revisão, pode haver erros. Use as trilhas como ponto de partida e siga a orientação dos seus
        professores.
      </p>
      <h2>Versão do catálogo</h2>
      <Carregando estado={meta}>
        {(m) => (
          <p className="suave">
            Catálogo {m.versao_catalogo}, gerado em {formatarData(m.gerado_em)}. {m.contagens.trilhas_publicadas} trilhas
            publicadas de {m.contagens.disciplinas_no_indice} disciplinas no índice.
          </p>
        )}
      </Carregando>
    </article>
  )
}

export function Privacidade() {
  return (
    <article>
      <h1>Privacidade</h1>
      <p>Este site não tem login, não usa cookies e não guarda nada sobre você.</p>
      <ul>
        <li>A busca pela sua grade acontece no seu navegador. O texto colado não é enviado a nenhum servidor.</li>
        <li>O site é hospedado no GitHub Pages. Como qualquer servidor web, o GitHub pode registrar dados técnicos de acesso, como endereço IP, conforme a política de privacidade do GitHub.</li>
        <li>
          Os formulários de avaliação e de envio de ementa são processados por um serviço externo. O que você envia fica
          sujeito também à política desse serviço. Não pedimos nome nem e-mail.
        </li>
        <li>
          Ementas enviadas são usadas para ampliar o catálogo, melhorar a busca, servir de exemplo para as etapas de
          extração e avaliar a qualidade das trilhas. Elas não são publicadas neste site e não são usadas para treinar
          modelos (fine-tuning).
        </li>
        <li>Não envie histórico escolar nem documentos com dados pessoais.</li>
      </ul>
      <h2>Exclusão</h2>
      <p>
        Para pedir a exclusão de algo que você enviou,{' '}
        {CONTATO ? <>escreva para <a href={`mailto:${CONTATO}`}>{CONTATO}</a></> : 'use o contato que será informado aqui antes do lançamento'}
        , descrevendo o envio (curso, disciplina e data aproximada).
      </p>
    </article>
  )
}

export function Contribuir() {
  return (
    <article>
      <h1>Como contribuir</h1>
      <h2>Envie ementas</h2>
      <p>
        Se a sua disciplina não aparece, ou aparece com outro nome, envie a ementa. Isso amplia o catálogo e melhora a
        busca por nome.
      </p>
      {FORM_EMENTA_URL ? (
        <p><a className="botao" href={FORM_EMENTA_URL.replace(/\{\w+\}/g, '')} target="_blank" rel="noopener noreferrer">Enviar ementa</a></p>
      ) : (
        <p className="suave">Formulário em configuração.</p>
      )}
      <p>Ao enviar, você autoriza o uso da ementa para ampliar e melhorar o catálogo de trilhas. Não envie documentos com dados pessoais.</p>
      <h2>Avalie as trilhas</h2>
      <p>
        No fim de cada trilha há os botões "útil" e "não útil", e cada recurso tem um link para reportar problema. É a
        principal forma de saber se o projeto está ajudando.
      </p>
      {!FORM_FEEDBACK_URL && <p className="suave">Formulário de avaliação em configuração.</p>}
    </article>
  )
}
