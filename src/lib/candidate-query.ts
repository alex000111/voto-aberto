export const ALL_BRAZILIAN_UFS = [
  'BR', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
  'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Apenas os colégios eleitorais com cobertura e candidaturas registradas no portal
export const REGISTERED_UFS = ['BR', 'BA', 'CE', 'MG', 'PE', 'PR', 'RJ', 'RS', 'SP'] as const;

export const UF_NAMES: Record<string, string> = {
  BR: 'BR — Presidência da República',
  BA: 'BA — Bahia',
  CE: 'CE — Ceará',
  MG: 'MG — Minas Gerais',
  PE: 'PE — Pernambuco',
  PR: 'PR — Paraná',
  RJ: 'RJ — Rio de Janeiro',
  RS: 'RS — Rio Grande do Sul',
  SP: 'SP — São Paulo'
};

export const UFS: readonly string[] = REGISTERED_UFS;
export const OFFICES = ['Presidente', 'Governador', 'Senador', 'Deputado Federal', 'Deputado Estadual', 'Deputado Distrital', 'Vice-presidente', 'Vice-governador', '1º Suplente', '2º Suplente'];
export type CandidateFilters = { uf?: string; office?: string; party?: string; q?: string; limit?: number; page?: number };
export function candidateQuery(opts:CandidateFilters={}){
 const params=new URLSearchParams({select:'*',active:'eq.true',election_year:'eq.2026',order:'office.asc,ballot_name.asc,id.asc'});
 const size=Math.min(100,Math.max(1,Math.trunc(opts.limit||24))),page=Math.min(10000,Math.max(1,Math.trunc(opts.page||1)));
 if(opts.uf){if(!UFS.includes(opts.uf.toUpperCase()))throw new Error('UF inválida.');params.set('uf',`eq.${opts.uf.toUpperCase()}`);}
 if(opts.office)params.set('office',`eq.${opts.office.toUpperCase()}`);
 if(opts.party)params.set('party',`eq.${opts.party.toUpperCase()}`);
 const q=opts.q?.trim().replace(/[%*_]/g,'').slice(0,80);if(q)params.set('ballot_name',`ilike.*${q}*`);
 params.set('limit',String(size+1));params.set('offset',String((page-1)*size));
 return {query:params.toString(),size,page};
}
