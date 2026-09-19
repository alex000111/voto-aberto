import Link from 'next/link';
import { dbConfigured, dbSelect } from '@/lib/supabase-rest';
import { candidateQuery, UFS, UF_NAMES, OFFICES } from '@/lib/candidate-query';
import DataNotice from '@/components/DataNotice';
import CandidatePhoto from '@/components/CandidatePhoto';
import type { Candidate } from '@/lib/candidates';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ uf?: string; cargo?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const uf = (sp.uf || '').toUpperCase();
  const cargo = sp.cargo || '';
  const q = (sp.q || '').slice(0, 80);

  let rows: Candidate[] = [];
  let failed = false;
  let invalid = false;
  let page = 1;
  let size = 24;

  try {
    const parsed = candidateQuery({ uf, office: cargo, q, page: Number(sp.page) || 1 });
    page = parsed.page;
    size = parsed.size;
    if (dbConfigured) {
      try {
        rows = await dbSelect('candidates', parsed.query);
      } catch {
        failed = true;
      }
    }
  } catch {
    invalid = true;
  }

  const more = rows.length > size;
  const candidates = rows.slice(0, size);
  const pageUrl = (n: number) =>
    `/candidaturas?${new URLSearchParams({ ...(uf ? { uf } : {}), ...(cargo ? { cargo } : {}), ...(q ? { q } : {}), page: String(n) })}`;

  return (
    <main className="page">
      <div className="eyebrow">ELEIÇÕES 2026 • DADOS RASTREÁVEIS</div>
      <h1>Candidaturas</h1>
      <p className="lead">
        Consulte os registros oficiais do TSE para a Presidência e os maiores colégios eleitorais do Brasil (SP, RJ, MG, BA, CE, RS, PR e PE).
        A situação de cada candidatura reflete a última coleta oficial.
      </p>

      {/* Filtros */}
      <form className="filters">
        <label>
          Nome na urna
          <input name="q" defaultValue={q} maxLength={80} placeholder="Buscar por nome..." />
        </label>

        <label>
          Colégio Eleitoral / UF
          <select name="uf" defaultValue={uf}>
            <option value="">Todas as UFs cadastradas</option>
            {UFS.map(x => (
              <option key={x} value={x}>
                {UF_NAMES[x] || x}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cargo em disputa
          <select name="cargo" defaultValue={cargo}>
            <option value="">Todos os cargos</option>
            {OFFICES.map(x => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>

        <button className="btn" type="submit">Filtrar</button>
        <Link className="btn secondary" href="/candidaturas">
          Limpar
        </Link>
      </form>

      {invalid ? (
        <div className="note" role="alert">
          Colégio eleitoral não disponível na cobertura atual. Por favor, selecione uma das UFs cadastradas na lista acima.
        </div>
      ) : !dbConfigured ? (
        <DataNotice state="unconfigured" />
      ) : failed ? (
        <DataNotice state="error" />
      ) : !candidates.length ? (
        <DataNotice state="empty" />
      ) : (
        <>
          <p className="stamp">
            Página {page} · {candidates.length} {candidates.length === 1 ? 'registro exibido' : 'registros exibidos'} {uf ? `em ${UF_NAMES[uf] || uf}` : 'nos colégios cadastrados'}
          </p>
          <div className="candidateGrid">
            {candidates.map(c => (
              <Link className="candidateCard" href={`/candidaturas/${encodeURIComponent(c.id)}`} key={c.id}>
                <CandidatePhoto
                  sourceId={c.source_id}
                  uf={c.uf}
                  name={c.ballot_name}
                  size={72}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="office">{c.office}</span>
                  <h2>{c.ballot_name}</h2>
                  <p>{c.full_name}</p>
                </div>
                <div className="candidateMeta">
                  <b>{c.number || '—'} • {c.party || '—'}</b>
                  <span>{c.uf || c.scope}</span>
                  <span className="statusPill">{c.registration_status || 'Situação não informada'}</span>
                  <small>
                    Coleta TSE: {c.source_updated_at ? new Date(c.source_updated_at).toLocaleDateString('pt-BR', { timeZone: 'America/Recife' }) : 'não informada'}
                  </small>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {dbConfigured && !failed && !invalid && (
        <nav className="actions" aria-label="Paginação">
          {page > 1 && (
            <Link className="btn secondary" href={pageUrl(page - 1)}>
              Anterior
            </Link>
          )}
          {more && (
            <Link className="btn" href={pageUrl(page + 1)}>
              Próxima
            </Link>
          )}
        </nav>
      )}

      <p className="stamp">
        <a href="https://dadosabertos.tse.jus.br/dataset/candidatos-2026" target="_blank" rel="noreferrer">
          Consultar a fonte primária oficial no portal de Dados Abertos do TSE ↗
        </a>
      </p>
    </main>
  );
}
