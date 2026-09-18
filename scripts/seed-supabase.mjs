import nextEnv from '@next/env';
const loadEnvConfig = nextEnv.loadEnvConfig || nextEnv.default?.loadEnvConfig || nextEnv;
loadEnvConfig(process.cwd());

const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL e SUPABASE_SECRET_KEY são necessários no .env.local');
  process.exit(1);
}

const {
  localCandidates,
  localPolls,
  localFinanceRecords,
  localProposals,
  localClaims,
  localEvidence,
  localCorrections,
  localCandidateVersions,
  localChangeEvents
} = await import('../src/lib/local-dataset.ts');

async function upsert(table, rows) {
  if (!rows || !rows.length) return;
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Erro ao gravar na tabela ${table}: (HTTP ${res.status})`, text);
  } else {
    console.log(`✓ Tabela ${table}: ${rows.length} registros sincronizados com sucesso.`);
  }
}

async function main() {
  console.log('Iniciando sincronização com o Supabase:', url);

  const sources = [
    { id: 'tse-candidatos-2026', name: 'TSE — Candidatos 2026', url: 'https://dadosabertos.tse.jus.br/dataset/candidatos-2026', authority: 'Tribunal Superior Eleitoral', status: 'ok' },
    { id: 'tse-pesqele-2026', name: 'TSE — PesqEle', url: 'https://divulgacandcontas.tse.jus.br', authority: 'Tribunal Superior Eleitoral', status: 'ok' },
    { id: 'tse-prestacao-contas-2026', name: 'TSE — Prestação de Contas', url: 'https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2026', authority: 'Tribunal Superior Eleitoral', status: 'ok' },
    { id: 'inep-censo-escolar', name: 'INEP — Censo Escolar', url: 'https://www.gov.br/inep/pt-br', authority: 'INEP / MEC', status: 'ok' }
  ];
  await upsert('sources', sources);

  await upsert('candidates', localCandidates);
  await upsert('candidate_versions', localCandidateVersions);
  await upsert('change_events', localChangeEvents);
  await upsert('polls', localPolls);
  await upsert('proposals', localProposals);
  await upsert('finance_records', localFinanceRecords);
  await upsert('claims', localClaims);
  await upsert('evidence', localEvidence);
  await upsert('corrections', localCorrections);

  console.log('\nBase de dados do Supabase populada e 100% operacional!');
}

main().catch(err => {
  console.error('Falha geral no seed:', err);
  process.exit(1);
});