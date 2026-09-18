import Link from 'next/link';
import { searchDocumentProposals } from '@/lib/proposals-search';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tema?: string }>;
}) {
  const { q = '', tema = '' } = await searchParams;
  const { results, isLiveDb, total } = await searchDocumentProposals(q, tema);

  const quickTopics = [
    'Educação',
    'Saúde',
    'Mobilidade',
    'Saneamento',
    'Segurança',
    'Tecnologia',
  ];

  return (
    <main className="page">
      <div className="eyebrow">ASSISTENTE CÍVICO DOCUMENTAL</div>
      <h1>Pergunte aos documentos</h1>
      <p className="lead">
        Consulte trechos literais dos planos de governo e diretrizes oficiais registradas no TSE.
        Todas as respostas exibem o documento de origem e a página correspondente, sem ranking ou recomendação de voto.
      </p>

      {/* Barra de Busca e Filtros */}
      <form method="GET" action="/assistente" className="filters" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="search-input" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            Palavra-chave ou termo de pesquisa nos documentos
          </label>
          <input
            id="search-input"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Ex.: universidades, atenção primária, metrô, saneamento..."
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--line)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
          {tema && <input type="hidden" name="tema" value={tema} />}
          <button type="submit" className="btn" style={{ padding: '12px 20px', cursor: 'pointer' }}>
            Pesquisar documentos
          </button>
          {(q || tema) && (
            <Link href="/assistente" className="btn secondary" style={{ padding: '12px 16px' }}>
              Limpar
            </Link>
          )}
        </div>
      </form>

      {/* Filtros rápidos por tema */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', margin: '14px 0 28px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
          Filtrar por tema:
        </span>
        {quickTopics.map(t => {
          const isActive = tema.toLowerCase() === t.toLowerCase();
          const targetUrl = isActive
            ? `/assistente${q ? `?q=${encodeURIComponent(q)}` : ''}`
            : `/assistente?${new URLSearchParams({ ...(q ? { q } : {}), tema: t }).toString()}`;

          return (
            <Link
              key={t}
              href={targetUrl}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '99px',
                border: '1px solid var(--line)',
                background: isActive ? 'var(--blue)' : '#fff',
                color: isActive ? '#fff' : 'inherit',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              {t}
            </Link>
          );
        })}
      </div>

      {/* Nota de integridade e neutralidade */}
      <div className="note" style={{ marginBottom: '28px' }}>
        <strong>Princípio de Neutralidade Documental:</strong> Este assistente localiza passagens literais extraídas dos documentos protocolados no TSE. Não são criadas sínteses eleitorais, avaliações subjetivas ou juízos de valor sobre as candidaturas.
        {!isLiveDb && ' Exibindo base de diretrizes registradas para demonstração e homologação local.'}
      </div>

      {/* Resultados da Pesquisa */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '22px', margin: 0 }}>
            {total} {total === 1 ? 'trecho documentado encontrado' : 'trechos documentados encontrados'}
          </h2>
          {(q || tema) && (
            <span className="stamp">
              Filtro ativo: {q ? `"${q}"` : ''} {tema ? `[Tema: ${tema}]` : ''}
            </span>
          )}
        </div>

        {results.length === 0 ? (
          <div className="placeholder" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>Nenhum trecho documental correspondente</h3>
            <p style={{ maxWidth: '500px', margin: '8px auto 20px', color: 'var(--muted)' }}>
              Tente pesquisar com outros termos ou selecione um dos temas acima para visualizar as diretrizes registradas.
            </p>
            <Link href="/assistente" className="btn secondary">
              Ver todas as diretrizes documentadas
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {results.map(item => (
              <article
                key={item.id}
                style={{
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span className="status" style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '11px', textTransform: 'uppercase', marginRight: '8px' }}>
                      {item.topic}
                    </span>
                    <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>
                      {item.candidate_name} {item.office ? `· ${item.office}` : ''}
                    </strong>
                  </div>
                  <span className="stamp" style={{ fontSize: '12px' }}>
                    Revisado em {new Date(item.reviewed_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <blockquote
                  style={{
                    margin: '8px 0',
                    padding: '14px 18px',
                    background: '#f8fafc',
                    borderLeft: '4px solid var(--blue)',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#1e293b'
                  }}
                >
                  “{item.excerpt}”
                </blockquote>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '13px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>
                    {item.page_number ? `Página ${item.page_number}` : 'Página não informada'} · Fonte: {item.source}
                  </span>
                  {item.document_url && /^https:\/\//.test(item.document_url) && (
                    <a
                      href={item.document_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Abrir documento oficial no TSE ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Próximos passos e cruzamentos */}
      <section className="section" style={{ margin: '48px 0 20px' }}>
        <h2>Cruzamento de dados eleitorais</h2>
        <div className="grid">
          <Link href="/comparador" className="card">
            <span className="tag">COMPARADOR</span>
            <h3>Compare planos lado a lado</h3>
            <p>Selecione duas candidaturas do mesmo cargo e visualize as propostas por eixo temático.</p>
            <b>Acessar comparador →</b>
          </Link>
          <Link href="/recife" className="card">
            <span className="tag">MUNICÍPIO</span>
            <h3>E o Recife?</h3>
            <p>Consulte a matriz de competências e os indicadores municipais oficiais da capital.</p>
            <b>Ver indicadores de Recife →</b>
          </Link>
          <Link href="/metodologia" className="card">
            <span className="tag">TRANSPARÊNCIA</span>
            <h3>Como verificamos</h3>
            <p>Conheça os critérios de ingestão de dados, extração de texto e garantia de neutralidade.</p>
            <b>Ler metodologia →</b>
          </Link>
        </div>
      </section>
    </main>
  );
}
