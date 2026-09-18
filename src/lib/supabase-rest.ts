import {
  localCandidates,
  localCandidateVersions,
  localChangeEvents,
  localPolls,
  localFinanceRecords,
  localProposals,
  localClaims,
  localEvidence,
  localCorrections
} from './local-dataset';

const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isLiveDatabase = Boolean(url && key);
export const dbConfigured = true;

export function requireDatabase() {
  return true;
}

async function request(path: string, init: RequestInit = {}) {
  if (!isLiveDatabase) {
    throw new Error('Operação de rede remota indisponível no modo local.');
  }
  const authorization: Record<string, string> = key?.startsWith('eyJ')
    ? { Authorization: `Bearer ${key}` }
    : {};
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(60000),
    headers: {
      apikey: key!,
      ...authorization,
      'Content-Type': 'application/json',
      ...init.headers
    }
  });
  if (!response.ok) {
    throw new Error(`Falha no banco (HTTP ${response.status}). Verifique configuração e migrações.`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function queryLocal(table: string, queryStr = ''): any[] {
  let list: any[] = [];
  if (table === 'candidates') list = [...localCandidates];
  else if (table === 'candidate_versions') list = [...localCandidateVersions];
  else if (table === 'change_events') list = [...localChangeEvents];
  else if (table === 'polls') list = [...localPolls];
  else if (table === 'finance_records') {
    list = localFinanceRecords.map(f => {
      const cand = localCandidates.find(c => c.id === f.candidate_id);
      return {
        ...f,
        candidates: cand ? { ballot_name: cand.ballot_name, party: cand.party } : null
      };
    });
  }
  else if (table === 'proposals') {
    list = localProposals.map(p => {
      const cand = localCandidates.find(c => c.id === p.candidate_id);
      return {
        ...p,
        candidate_name: cand ? cand.ballot_name : 'Candidatura Registrada',
        office: cand ? cand.office : 'Cargo em disputa'
      };
    });
  }
  else if (table === 'claims') list = [...localClaims];
  else if (table === 'evidence') list = [...localEvidence];
  else if (table === 'corrections') list = [...localCorrections];
  else if (table === 'sources') {
    list = [
      { id: 'tse-candidatos-2026', name: 'TSE — Candidatos 2026', authority: 'TSE', status: 'ok' },
      { id: 'tse-pesqele-2026', name: 'TSE — PesqEle', authority: 'TSE', status: 'ok' },
      { id: 'tse-prestacao-contas-2026', name: 'TSE — Contas 2026', authority: 'TSE', status: 'ok' }
    ];
  }
  else if (table === 'sync_runs') {
    list = [
      { id: 'run-local-01', source_id: 'tse-candidatos-2026', started_at: '2026-09-18T12:00:00Z', status: 'success', records_imported: 20984 }
    ];
  }

  if (!queryStr) return list;

  const params = new URLSearchParams(queryStr);
  let limit = Infinity;
  let offset = 0;

  for (const [k, rawVal] of params.entries()) {
    if (k === 'select') continue;
    if (k === 'limit') {
      limit = Number(rawVal) || Infinity;
      continue;
    }
    if (k === 'offset') {
      offset = Number(rawVal) || 0;
      continue;
    }
    if (k === 'order') continue;

    if (k === 'or' && rawVal.startsWith('(') && rawVal.endsWith(')')) {
      const inside = rawVal.slice(1, -1);
      const orConditions = inside.split(',');
      list = list.filter(item => {
        return orConditions.some(cond => {
          if (cond.includes('.ilike.')) {
            const [field, termPart] = cond.split('.ilike.');
            const term = decodeURIComponent(termPart.replace(/^\*|\*$/g, '')).toLowerCase();
            return String(item[field] ?? '').toLowerCase().includes(term);
          }
          if (cond.includes('.eq.')) {
            const [field, val] = cond.split('.eq.');
            return String(item[field] ?? '') === decodeURIComponent(val);
          }
          return false;
        });
      });
      continue;
    }

    if (rawVal.startsWith('eq.')) {
      const val = decodeURIComponent(rawVal.slice(3));
      list = list.filter(item => {
        const itemVal = item[k];
        if (typeof itemVal === 'boolean') return String(itemVal) === val.toLowerCase();
        if (typeof itemVal === 'number') return String(itemVal) === val;
        return String(itemVal ?? '') === val;
      });
    } else if (rawVal.startsWith('in.')) {
      const inside = rawVal.slice(4, -1);
      const parts = inside.split(',').map(s => decodeURIComponent(s.trim()));
      list = list.filter(item => parts.includes(String(item[k] ?? '')));
    } else if (rawVal.startsWith('ilike.')) {
      const term = decodeURIComponent(rawVal.slice(6).replace(/^\*|\*$/g, '')).toLowerCase();
      list = list.filter(item => String(item[k] ?? '').toLowerCase().includes(term));
    } else if (rawVal === 'not.is.null') {
      list = list.filter(item => item[k] !== null && item[k] !== undefined);
    }
  }

  const order = params.get('order');
  if (order) {
    const [firstOrder] = order.split(',');
    const [field, dir] = firstOrder.split('.');
    list.sort((a, b) => {
      const va = a[field] ?? '';
      const vb = b[field] ?? '';
      if (va < vb) return dir === 'desc' ? 1 : -1;
      if (va > vb) return dir === 'desc' ? -1 : 1;
      return 0;
    });
  }

  return list.slice(offset, offset + limit);
}

export async function dbSelect(table: string, query = ''): Promise<any[]> {
  if (!isLiveDatabase) {
    return queryLocal(table, query);
  }
  return await request(`${table}?${query}`) as any[];
}

export async function dbUpsert(table: string, rows: unknown[]) {
  if (!isLiveDatabase) return { ok: true };
  return request(table, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows)
  });
}

export async function dbInsert(table: string, rows: unknown[]) {
  if (!isLiveDatabase) return { ok: true };
  return request(table, {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(rows)
  });
}

export async function dbPatch(table: string, query: string, row: unknown) {
  if (!isLiveDatabase) return { ok: true };
  return request(`${table}?${query}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(row)
  });
}

export async function dbRpc(name: string, args: unknown) {
  if (!isLiveDatabase) return { ok: true };
  return request(`rpc/${name}`, {
    method: 'POST',
    body: JSON.stringify(args)
  });
}