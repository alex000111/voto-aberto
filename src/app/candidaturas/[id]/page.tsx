import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCandidate, getCandidateChanges, getCandidateHistory, getCandidateProposals } from '@/lib/candidates';
import { candidateOfficialResources } from '@/lib/candidate-resources';
import { detailedProposals } from '@/lib/proposals-data';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getCandidate(id);
  if (!c) notFound();

  const [history, changes, dbProposals] = await Promise.all([
    getCandidateHistory(id),
    getCandidateChanges(id),
    getCandidateProposals(id),
  ]);

  let official: any = null;
  try {
    official = await candidateOfficialResources(c.uf || c.scope);
  } catch {}

  // Buscar propostas detalhadas (com resumos e tópicos)
  const candidateDetailed = detailedProposals.filter(
    p => p.candidate_id === id || p.candidate_name.toLowerCase() === (c.ballot_name || '').toLowerCase()
  );

  return (
    <main className="page">
      <Link className="back" href="/candidaturas">
        ← Voltar para Candidaturas
      </Link>

      <div className="profileHead">
        <div>
          <div className="eyebrow">
            {c.office} • {c.uf || c.scope}
          </div>
          <h1>{c.ballot_name}</h1>
          <p className="lead">{c.full_name}</p>
        </div>
        <div className="ballot">
          <strong>{c.number || '—'}</strong>
          <span>{c.party || 'Partido não informado'}</span>
        </div>
      </div>

      <div className="profileGrid">
        <section className="card">
          <span className="tag">SITUAÇÃO REGISTRADA</span>
          <h3>{c.registration_status || 'Não informada'}</h3>
          <p>
            Última sincronização com TSE:{' '}
            {c.source_updated_at
              ? new Date(c.source_updated_at).toLocaleString('pt-BR', { timeZone: 'America/Recife' })
              : 'não disponível'}
            .
          </p>
        </section>

        <section className="card">
          <span className="tag">PROVENIÊNCIA OFICIAL</span>
          <h3>Tribunal Superior Eleitoral</h3>
          <p>
            O Voto Aberto preserva versões históricas e não converte a situação cadastral em julgamento moral sobre a candidatura.
          </p>
        </section>
      </div>

      {/* Propostas e Diretrizes de Governo */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2>Propostas e Diretrizes Registradas</h2>
            <p style={{ margin: 0 }}>
              Compromissos e metas protocoladas pela candidatura no TSE.
            </p>
          </div>
          {candidateDetailed.length > 0 && (
            <Link className="btn secondary" href={`/propostas?candidato=${encodeURIComponent(id)}`}>
              ⚡ Ver no Painel de Propostas com Resumos
            </Link>
          )}
        </div>

        {candidateDetailed.length > 0 ? (
          <div style={{ display: 'grid', gap: '18px' }}>
            {candidateDetailed.map(p => (
              <article key={p.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span className="tag">{p.topic}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    Página {p.page_number} do documento oficial do TSE
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '8px' }}>
                    ⚡ Síntese Executiva
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.7 }}>
                    {p.summary_bullets.map((bullet, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                <details style={{ marginTop: '12px', background: 'var(--surface-alt)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '13px', color: 'var(--blue)' }}>
                    Ver trecho literal transcrito do TSE ▾
                  </summary>
                  <blockquote style={{ margin: '12px 0 8px', borderLeft: '3px solid var(--blue)', paddingLeft: '14px', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.6 }}>
                    &ldquo;{p.excerpt}&rdquo;
                  </blockquote>
                </details>

                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <a href={p.document_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--blue)' }}>
                    Abrir documento do plano de governo no TSE ↗
                  </a>
                  <span className="stamp">Revisado em {new Date(p.reviewed_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </article>
            ))}
          </div>
        ) : dbProposals.length > 0 ? (
          <div style={{ display: 'grid', gap: '14px' }}>
            {dbProposals.map((p: any) => (
              <article key={p.id} className="card">
                <span className="tag">{p.topic}</span>
                <blockquote style={{ margin: '10px 0', fontStyle: 'italic' }}>
                  &ldquo;{p.excerpt}&rdquo;
                </blockquote>
                <p>
                  <a href={p.document_url} target="_blank" rel="noreferrer">
                    Documento oficial · página {p.page_number ?? 'não informada'} ↗
                  </a>
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="placeholder">
            Nenhum trecho de proposta foi revisado até o momento para esta candidatura. O plano de governo completo pode ser consultado no repositório oficial do TSE.
          </div>
        )}
      </section>

      {/* Documentos Oficiais */}
      <section className="section">
        <h2>Documentos oficiais disponíveis</h2>
        <p>
          Arquivos publicados pela Justiça Eleitoral para a circunscrição desta candidatura ({c.uf || c.scope}).
        </p>
        {official ? (
          <div className="profileGrid">
            <section className="card">
              <span className="tag">PLANO DE GOVERNO</span>
              <h3>
                {official.proposals.length ? 'Disponível na fonte oficial' : 'Não localizada para esta circunscrição'}
              </h3>
              {official.proposals.slice(0, 2).map((r: any) => (
                <a key={r.id} href={r.url} target="_blank" rel="noreferrer">
                  Baixar arquivo original do TSE ↗
                </a>
              ))}
            </section>
            <section className="card">
              <span className="tag">OUTROS RECURSOS</span>
              <h3>Fotos, certidões e dados complementares</h3>
              <p>
                {official.photos.length} recurso(s) de foto • {official.certificates.length} recurso(s) de certidões criminais.
              </p>
            </section>
          </div>
        ) : (
          <div className="placeholder">
            Catálogo oficial temporariamente indisponível. Nenhuma ausência é inferida a partir desta falha.
          </div>
        )}
      </section>

      {/* Histórico Auditável */}
      <section className="section">
        <h2>Histórico auditável de versões</h2>
        <p>
          Alterações registradas pelo sistema de auditoria na base do TSE. O histórico permite auditar quando cada dado mudou.
        </p>
        {changes.length ? (
          <div className="timeline">
            {changes.map((x: any) => (
              <div key={x.id}>
                <b>{new Date(x.detected_at).toLocaleString('pt-BR', { timeZone: 'America/Recife' })}</b>
                <span>
                  {x.details?.status || 'Registro atualizado'} • {x.details?.party || c.party}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder">
            Registro inicial importado da fonte oficial sem alterações posteriores.
          </div>
        )}
        <p className="stamp">Versões preservadas no banco de dados: {history.length || 1}</p>
      </section>
    </main>
  );
}
