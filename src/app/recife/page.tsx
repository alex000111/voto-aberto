import Link from 'next/link';
import { recifeTopics } from '@/data/recife-data';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>;
}) {
  const { tema = 'mobilidade' } = await searchParams;
  const currentTopic = recifeTopics.find(t => t.slug === tema) || recifeTopics[0];

  return (
    <main className="page">
      <div className="eyebrow">IMPACTO LOCAL & FEDERALISMO</div>
      <h1>E o Recife?</h1>
      <p className="lead">
        Indicadores municipais oficiais e matriz de competências da Constituição Federal (Art. 30).
        Compare as promessas das candidaturas com a capacidade real de cada esfera de governo.
      </p>

      {/* Seletor de temas */}
      <div className="statusGrid" style={{ margin: '20px 0 32px' }}>
        {recifeTopics.map(t => (
          <Link
            key={t.slug}
            href={`/recife?tema=${t.slug}`}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '99px',
              border: '1px solid var(--line)',
              background: t.slug === currentTopic.slug ? 'var(--blue)' : 'var(--surface)',
              color: t.slug === currentTopic.slug ? '#fff' : 'var(--ink)',
              fontWeight: 700,
              fontSize: '13px',
              transition: '0.15s'
            }}
          >
            {t.title}
          </Link>
        ))}
      </div>

      {/* Painel do Tema Selecionado */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px', padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="tag" style={{ color: 'var(--blue)', fontWeight: 800, fontSize: '12px' }}>TEMA EM DESTAQUE</span>
            <h2 style={{ fontSize: '30px', margin: '6px 0 10px', letterSpacing: '-1px', color: 'var(--ink)' }}>{currentTopic.title}</h2>
            <p style={{ color: 'var(--muted)', margin: 0, maxWidth: '750px', fontSize: '15px' }}>{currentTopic.description}</p>
          </div>
          <Link href="/comparador" className="btn secondary" style={{ fontSize: '13px', padding: '9px 14px' }}>
            Comparar propostas neste tema →
          </Link>
        </div>

        {/* Indicadores */}
        <h3 style={{ fontSize: '17px', margin: '28px 0 14px', letterSpacing: '-0.5px', color: 'var(--ink)' }}>Indicadores Oficiais</h3>
        <div className="metricGrid" style={{ margin: '0 0 24px' }}>
          {currentTopic.indicators.map(ind => (
            <div className="metric" key={ind.id}>
              <b>{ind.value}</b>
              <strong style={{ fontSize: '14px', margin: '4px 0', color: 'var(--ink)' }}>{ind.metric}</strong>
              <span style={{ fontSize: '13px', lineHeight: 1.4 }}>{ind.context}</span>
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '11px', color: 'var(--muted)' }}>
                Fonte: <a href={ind.sourceUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>{ind.source}</a> ({ind.year})
              </div>
            </div>
          ))}
        </div>

        {/* Matriz de Competências Constitucionais */}
        <h3 style={{ fontSize: '17px', margin: '32px 0 14px', letterSpacing: '-0.5px', color: 'var(--ink)' }}>
          Quem faz o quê? (Competências Constitucionais)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 800, color: 'var(--blue)', fontSize: '12px', marginBottom: '6px' }}>MUNICÍPIO (Prefeitura e Câmara)</div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--ink-light)' }}>{currentTopic.competency.municipalRole}</p>
          </div>
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 800, color: 'var(--emerald)', fontSize: '12px', marginBottom: '6px' }}>ESTADO (Governo e ALEPE)</div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--ink-light)' }}>{currentTopic.competency.stateRole}</p>
          </div>
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 800, color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' }}>UNIÃO (Governo Federal e Congresso)</div>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--ink-light)' }}>{currentTopic.competency.federalRole}</p>
          </div>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '10px' }}>
          Base jurídica: {currentTopic.competency.legalBasis}
        </p>

        {/* Questões-chave */}
        <div style={{ marginTop: '24px', background: 'var(--blue-subtle)', border: '1px solid var(--blue)', borderRadius: '12px', padding: '18px' }}>
          <strong style={{ display: 'block', fontSize: '13px', color: 'var(--blue)', marginBottom: '8px' }}>
            PERGUNTAS PARA CHECAR NOS PLANOS DE GOVERNO
          </strong>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.6, color: 'var(--ink)' }}>
            {currentTopic.keyQuestions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Chamada para consulta e checagem */}
      <section className="section" style={{ margin: '40px 0 20px' }}>
        <h2>Aprofunde a pesquisa</h2>
        <div className="grid">
          <Link href="/candidaturas?uf=PE" className="card">
            <span className="tag">CANDIDATURAS EM PE</span>
            <h3>Quem disputa em Pernambuco</h3>
            <p>Consulte registros, declarações e situação oficial de candidaturas estaduais e federais.</p>
            <b>Consultar candidatos →</b>
          </Link>
          <Link href="/comparador" className="card">
            <span className="tag">COMPARADOR</span>
            <h3>Planos de governo registrados</h3>
            <p>Compare trechos exatos de diretrizes por tema com indicação de página e link do TSE.</p>
            <b>Abrir comparador →</b>
          </Link>
          <Link href="/assistente" className="card">
            <span className="tag">ASSISTENTE CÍVICO</span>
            <h3>Pergunte aos documentos</h3>
            <p>Busque menções temáticas sobre diretrizes oficiais com comprovação documental.</p>
            <b>Pesquisar documentos →</b>
          </Link>
        </div>
      </section>
    </main>
  );
}
