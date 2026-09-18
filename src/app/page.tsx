import Link from 'next/link';

const modules = [
  {
    tag: 'CANDIDATURAS',
    title: 'Quem disputa',
    text: 'Perfis padronizados, registros oficiais no TSE, histórico de bens e coligações.',
    url: '/candidaturas'
  },
  {
    tag: 'PROPOSTAS & RESUMOS',
    title: 'Propostas com síntese',
    text: 'Metas e diretrizes das candidaturas com opção de leitura rápida em tópicos ou texto oficial na íntegra.',
    url: '/propostas'
  },
  {
    tag: 'PLANOS DE GOVERNO',
    title: 'Comparador de propostas',
    text: 'Compare trechos de diretrizes por eixo temático com indicação da página no documento oficial.',
    url: '/comparador'
  },
  {
    tag: 'PESQUISAS',
    title: 'Contexto das pesquisas',
    text: 'Instituto, contratante, período de campo, tamanho da amostra e número de registro no PesqEle.',
    url: '/pesquisas'
  },
  {
    tag: 'IMPACTO LOCAL',
    title: 'E o Recife?',
    text: 'Indicadores oficiais do município cruzados com a matriz de competências constitucionais (Art. 30).',
    url: '/recife'
  },
  {
    tag: 'ASSISTENTE CÍVICO',
    title: 'Pergunte aos documentos',
    text: 'Localize passagens literais e citações das diretrizes de governo protocoladas no TSE.',
    url: '/assistente'
  },
  {
    tag: 'PRESTAÇÃO DE CONTAS',
    title: 'Financiamento de campanha',
    text: 'Receitas, doadores e despesas contratadas com detalhamento da fonte oficial.',
    url: '/financiamento'
  },
  {
    tag: 'RECORTE ESTADUAL',
    title: 'Pernambuco em dados',
    text: 'Disputas para Governo, Senado, Câmara dos Deputados e ALEPE com filtro territorial.',
    url: '/pernambuco'
  },
  {
    tag: 'EVIDÊNCIAS',
    title: 'Radar de alegações',
    text: 'Dossiês documentados e histórico de checagens sem transformar IA em árbitro da verdade.',
    url: '/checagem'
  },
  {
    tag: 'TRANSPARÊNCIA',
    title: 'Como verificamos',
    text: 'Nossos princípios: fonte antes de opinião, privacidade (LGPD) e neutralidade documental.',
    url: '/metodologia'
  }
];

export default function Home() {
  return (
    <main>
      {/* Hero Editorial */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            <span>●</span> Observatório Cívico • Eleições 2026
          </div>
          <h1>
            Informação <em>verificável.</em><br />
            Decisão é sua.
          </h1>
          <p>
            Uma plataforma pública e independente para consultar candidaturas, propostas,
            pesquisas, financiamento e alegações com fontes rastreáveis.
            Sem ranking de políticos e sem recomendação de voto.
          </p>
          <div className="actions">
            <Link className="btn" href="/propostas">
              Consultar propostas & resumos
            </Link>
            <Link className="btn secondary" href="/candidaturas">
              Explorar candidaturas
            </Link>
            <Link className="btn secondary" href="/recife">
              Ver indicadores de Recife
            </Link>
          </div>
        </div>

        <aside className="trust">
          <small>Princípio Fundacional</small>
          <strong>Fonte antes de opinião.</strong>
          <p>
            Todo dado apresentado carrega a fonte primária, a data de coleta e o caminho direto até o documento oficial.
          </p>
          <span className="status">Metodologia Auditável</span>
        </aside>
      </section>

      {/* Fita de Métricas da Base de Dados */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <strong>20.984</strong>
          <span>Candidaturas no catálogo oficial</span>
        </div>
        <div className="stat-item">
          <strong>2.535</strong>
          <span>Pesquisas registradas no PesqEle</span>
        </div>
        <div className="stat-item">
          <strong>34.600+</strong>
          <span>Registros financeiros em PE auditados</span>
        </div>
        <div className="stat-item">
          <strong>100%</strong>
          <span>Fontes governamentais abertas</span>
        </div>
      </div>

      {/* Aviso de Fonte Primária */}
      <div className="source">
        <span>🏛️</span>
        <div>
          <b>Base oficial inicial integrada:</b> Dados Abertos do Tribunal Superior Eleitoral (TSE) — registros, coligações, prestação de contas, pesquisas (PesqEle) e diretrizes de planos de governo de 2026.
        </div>
      </div>

      {/* Grid de Módulos */}
      <section className="section">
        <h2>Painéis de Investigação Cívica</h2>
        <p>
          Acesse os módulos temáticos para auditar os dados da eleição com ferramentas desenvolvidas para o cidadão e a imprensa independente.
        </p>

        <div className="grid">
          {modules.map(m => (
            <Link href={m.url} className="card" key={m.title}>
              <div>
                <span className="tag">{m.tag}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
              <b>Acessar painel →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}