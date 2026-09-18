import Link from 'next/link';
import { detailedProposals } from '@/lib/proposals-data';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string; candidato?: string; modo?: string }>;
}) {
  const sp = await searchParams;
  const tema = sp.tema || '';
  const candidato = sp.candidato || '';
  const modo = sp.modo === 'literal' ? 'literal' : 'resumo';

  // Obter listas únicas para os filtros
  const availableTopics = Array.from(new Set(detailedProposals.map(p => p.topic)));
  const availableCandidates = Array.from(
    new Set(detailedProposals.map(p => JSON.stringify({ id: p.candidate_id, name: p.candidate_name, office: p.office })))
  ).map(s => JSON.parse(s) as { id: string; name: string; office: string });

  // Filtragem
  const filtered = detailedProposals.filter(p => {
    const matchTopic = !tema || p.topic.toLowerCase() === tema.toLowerCase();
    const matchCandidate = !candidato || p.candidate_id === candidato;
    return matchTopic && matchCandidate;
  });

  return (
    <main className="page">
      <div className="eyebrow">PLANOS DE GOVERNO • REGISTROS OFICIAIS</div>
      <h1>Propostas das Candidaturas</h1>
      <p className="lead">
        Consulte as metas e diretrizes protocoladas na Justiça Eleitoral.
        Você pode alternar entre a <strong>Leitura Rápida (Resumos em Tópicos)</strong> ou conferir o <strong>Texto Literal Completo</strong> com link e página do documento original do TSE.
      </p>

      {/* Alternador de Modo de Leitura */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
          Formato de Leitura:
        </span>
        <div style={{ display: 'inline-flex', background: 'var(--surface-alt)', padding: '4px', borderRadius: '10px', border: '1px solid var(--line)' }}>
          <Link
            href={`/propostas?${new URLSearchParams({ ...(tema ? { tema } : {}), ...(candidato ? { candidato } : {}), modo: 'resumo' }).toString()}`}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 750,
              background: modo === 'resumo' ? 'var(--blue)' : 'transparent',
              color: modo === 'resumo' ? '#ffffff' : 'var(--ink)',
              transition: 'all 0.15s ease'
            }}
          >
            ⚡ Leitura Rápida (Resumos)
          </Link>
          <Link
            href={`/propostas?${new URLSearchParams({ ...(tema ? { tema } : {}), ...(candidato ? { candidato } : {}), modo: 'literal' }).toString()}`}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 750,
              background: modo === 'literal' ? 'var(--blue)' : 'transparent',
              color: modo === 'literal' ? '#ffffff' : 'var(--ink)',
              transition: 'all 0.15s ease'
            }}
          >
            📄 Texto Literal Completo
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <form method="GET" action="/propostas" className="filters">
        <input type="hidden" name="modo" value={modo} />
        <label>
          Tema
          <select name="tema" defaultValue={tema}>
            <option value="">Todos os temas</option>
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label>
          Candidatura
          <select name="candidato" defaultValue={candidato}>
            <option value="">Todas as candidaturas</option>
            {availableCandidates.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.office})</option>
            ))}
          </select>
        </label>

        <button type="submit" className="btn">Filtrar</button>
        {(tema || candidato) && (
          <Link href={`/propostas?modo=${modo}`} className="btn secondary">
            Limpar Filtros
          </Link>
        )}
      </form>

      {/* Nota de Metodologia e Neutralidade */}
      <div className="note" style={{ marginBottom: '32px' }}>
        <strong>Metodologia de Síntese:</strong> Os resumos em tópicos são elaborados estritamente a partir das sentenças e compromissos do plano de governo original arquivado no TSE, sem atribuição de notas morais nem juízos ideológicos. O trecho oficial e o PDF permanecem sempre acessíveis a 1 clique.
      </div>

      {/* Lista de Propostas */}
      <div style={{ display: 'grid', gap: '22px' }}>
        {filtered.length === 0 ? (
          <div className="placeholder" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>Nenhuma proposta localizada com os filtros selecionados</h3>
            <p style={{ margin: '10px 0 20px', color: 'var(--muted)' }}>
              Tente selecionar outro tema ou candidatura para consultar os planos.
            </p>
            <Link href="/propostas" className="btn secondary">Ver todas as propostas</Link>
          </div>
        ) : (
          filtered.map(p => (
            <article
              key={p.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                transition: 'border-color 0.2s ease'
              }}
            >
              {/* Cabeçalho do Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span className="office" style={{ marginRight: '10px' }}>{p.topic}</span>
                  <strong style={{ fontSize: '18px', color: 'var(--ink)' }}>
                    <Link href={`/candidaturas/${encodeURIComponent(p.candidate_id)}`} style={{ textDecoration: 'underline' }}>
                      {p.candidate_name}
                    </Link>{' '}
                    <span style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '14px' }}>
                      • {p.party} • {p.office} ({p.uf})
                    </span>
                  </strong>
                </div>
                <span className="stamp">
                  Revisado em {new Date(p.reviewed_at).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Exibição: Modo Resumo vs Modo Literal */}
              {modo === 'resumo' ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue)', background: 'var(--blue-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                      RESUMO EXECUTIVO
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Pontos-chave declarados no plano</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', color: 'var(--ink)' }}>
                    {p.summary_bullets.map((bullet, idx) => (
                      <li key={idx} style={{ lineHeight: 1.6 }}>{bullet}</li>
                    ))}
                  </ul>

                  {/* Detalhes com Texto Literal Opcional */}
                  <details style={{ marginTop: '14px' }}>
                    <summary style={{ fontSize: '13px', color: 'var(--blue)', cursor: 'pointer', fontWeight: 700 }}>
                      Ver trecho literal completo do documento oficial ▾
                    </summary>
                    <blockquote
                      style={{
                        margin: '12px 0 6px',
                        padding: '14px 18px',
                        background: 'var(--surface-alt)',
                        borderLeft: '4px solid var(--blue)',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'var(--ink)'
                      }}
                    >
                      “{p.excerpt}”
                    </blockquote>
                  </details>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', background: 'var(--emerald-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                      TEXTO LITERAL OFICIAL
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Trecho protocolado no TSE</span>
                  </div>
                  <blockquote
                    style={{
                      margin: '10px 0',
                      padding: '16px 20px',
                      background: 'var(--surface-alt)',
                      borderLeft: '4px solid var(--blue)',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: 'var(--ink)'
                    }}
                  >
                    “{p.excerpt}”
                  </blockquote>
                </div>
              )}

              {/* Rodapé do Card com Proveniência e Link do TSE */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line)',
                  fontSize: '13px'
                }}
              >
                <span style={{ color: 'var(--muted)' }}>
                  Documento Oficial • <strong>Página {p.page_number}</strong>
                </span>
                <a
                  href={p.document_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--blue)', fontWeight: 750, textDecoration: 'underline' }}
                >
                  Abrir no DivulgaCandContas do TSE ↗
                </a>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Navegação Cruzada */}
      <section className="section" style={{ margin: '54px 0 20px' }}>
        <h2>Cruzamento de Propostas</h2>
        <div className="grid">
          <Link href="/comparador" className="card">
            <span className="tag">COMPARADOR</span>
            <h3>Compare dois planos lado a lado</h3>
            <p>Selecione duas candidaturas ao mesmo cargo e visualize as propostas agrupadas por área.</p>
            <b>Abrir comparador →</b>
          </Link>
          <Link href="/assistente" className="card">
            <span className="tag">ASSISTENTE CÍVICO</span>
            <h3>Pergunte aos documentos</h3>
            <p>Pesquise palavras-chave específicas em todos os planos de governo catalogados.</p>
            <b>Pesquisar termos →</b>
          </Link>
          <Link href="/recife" className="card">
            <span className="tag">IMPACTO LOCAL</span>
            <h3>E o Recife?</h3>
            <p>Cruze as promessas das campanhas com a matriz de competências constitucionais do município.</p>
            <b>Ver competências →</b>
          </Link>
        </div>
      </section>
    </main>
  );
}