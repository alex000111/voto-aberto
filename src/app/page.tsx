import Link from 'next/link';

const modules = [
  {
    tag: 'CANDIDATURAS',
    icon: '🗳️',
    title: 'Quem disputa',
    text: 'Perfis padronizados de 20.984 candidatos em todas as 27 UFs, com partidos, números e situação regular no TSE.',
    url: '/candidaturas'
  },
  {
    tag: 'PROPOSTAS & RESUMOS',
    icon: '📑',
    title: 'Propostas com síntese executiva',
    text: 'Metas declaradas no plano de governo com opção de leitura rápida em tópicos ou texto oficial na íntegra.',
    url: '/propostas'
  },
  {
    tag: 'INTEGRIDADE & CHECAGEM',
    icon: '🛡️',
    title: 'Laboratório & Radar Anti-Fake News',
    text: 'Cole prints do WhatsApp (Ctrl+V), faça leitura de imagens via OCR e audite a veracidade nas bases oficiais do TSE.',
    url: '/checagem'
  },
  {
    tag: 'PLANOS DE GOVERNO',
    icon: '⚖️',
    title: 'Comparador temático',
    text: 'Compare diretrizes por eixo (Saúde, Educação, Segurança) com citação de página do documento protocolado.',
    url: '/comparador'
  },
  {
    tag: 'PESQUISAS ELEITORAIS',
    icon: '📊',
    title: 'Contexto e registro no PesqEle',
    text: 'Metodologia, contratante, período de campo, tamanho da amostra e número de registro obrigatório no TSE.',
    url: '/pesquisas'
  },
  {
    tag: 'PRESTAÇÃO DE CONTAS',
    icon: '💰',
    title: 'Financiamento de campanha',
    text: 'Receitas arrecadadas, doadores, despesas contratadas e fundo eleitoral com detalhamento oficial.',
    url: '/financiamento'
  },
  {
    tag: 'IMPACTO LOCAL',
    icon: '🏛️',
    title: 'E o Recife? (Federalismo)',
    text: 'Indicadores socioeconômicos da capital cruzados com a matriz de competências do Art. 30 da Constituição.',
    url: '/recife'
  },
  {
    tag: 'ASSISTENTE CÍVICO',
    icon: '🔍',
    title: 'Pergunte aos documentos',
    text: 'Localize passagens literais e citações das diretrizes de governo protocoladas no TSE com busca semântica.',
    url: '/assistente'
  },
  {
    tag: 'TRANSPARÊNCIA',
    icon: '📜',
    title: 'Metodologia e Princípios',
    text: 'Nossos pilares: fonte antes de opinião, neutralidade estrita, privacidade (LGPD) e controle social.',
    url: '/metodologia'
  }
];

export default function Home() {
  return (
    <main>
      {/* Hero Editorial Republicano */}
      <section className="hero">
        <div>
          <div className="eyebrow" style={{ color: 'var(--br-green)' }}>
            <span>🇧🇷</span> REPÚBLICA FEDERATIVA DO BRASIL • ELEIÇÕES GERAIS 2026
          </div>
          <h1>
            Informação <em>verificável.</em><br />
            A soberania do voto é sua.
          </h1>
          <p>
            Uma plataforma pública, independente e apartidária a serviço da cidadania e da democracia brasileira.
            Consulte <strong>20.984 candidaturas</strong> em todas as 27 UFs, leia resumos e diretrizes oficiais de governo protocoladas no TSE e audite mensagens com ferramentas contra a desinformação.
          </p>
          <div className="actions">
            <Link className="btn" href="/propostas">
              <span>📑</span> Consultar Propostas & Resumos
            </Link>
            <Link className="btn" href="/checagem" style={{ background: 'linear-gradient(135deg, #00875a 0%, #059669 100%)' }}>
              <span>🛡️</span> Radar Anti-Fake News (OCR)
            </Link>
            <Link className="btn secondary" href="/candidaturas">
              <span>🗳️</span> Explorar Candidaturas
            </Link>
          </div>
        </div>

        {/* Painel da Constituição Cidadã */}
        <aside className="trust">
          <small>
            <span>⚖️</span> Constituição Cidadã de 1988
          </small>
          <strong>Art. 1º, Parágrafo Único</strong>
          <p>
            &ldquo;Todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente, nos termos desta Constituição.&rdquo;
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="status">
              ✓ Fonte antes de Opinião
            </span>
            <span className="status" style={{ background: 'var(--blue-subtle)', color: 'var(--blue)', borderColor: 'var(--blue)' }}>
              100% Auditável
            </span>
          </div>
        </aside>
      </section>

      {/* Fita de Métricas Federativas Nacionais */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <strong>
            <span>🇧🇷</span> 27 UFs
          </strong>
          <span>Todas as Unidades da Federação cobertas</span>
        </div>
        <div className="stat-item">
          <strong>
            <span>🏛️</span> 20.984
          </strong>
          <span>Candidaturas na base oficial do TSE</span>
        </div>
        <div className="stat-item">
          <strong>
            <span>📊</span> 2.535
          </strong>
          <span>Pesquisas registradas no PesqEle</span>
        </div>
        <div className="stat-item">
          <strong>
            <span>🛡️</span> SOS Voto
          </strong>
          <span>Disque 1491 & Canal Oficial Antifraude</span>
        </div>
      </div>

      {/* Aviso Institucional de Dados Abertos */}
      <div className="source">
        <span style={{ fontSize: '24px' }}>🏛️</span>
        <div>
          <b>Base oficial integrada:</b> Dados Abertos do Tribunal Superior Eleitoral (TSE) — candidaturas, prestações de contas, pesquisas registradas (PesqEle) e diretrizes de planos de governo arquivadas para o pleito de 2026.
        </div>
      </div>

      {/* Grid de Módulos */}
      <section className="section">
        <h2>Painéis de Investigação Cívica</h2>
        <p>
          Acesse os módulos temáticos para auditar os dados da eleição com ferramentas desenvolvidas para o cidadão, pesquisadores e a imprensa independente.
        </p>

        <div className="grid">
          {modules.map(m => (
            <Link href={m.url} className="card" key={m.title}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="tag">{m.tag}</span>
                  <span style={{ fontSize: '20px' }}>{m.icon}</span>
                </div>
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