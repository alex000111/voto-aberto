export const UFS=['BR','AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
export const OFFICES=['Presidente','Vice-presidente','Governador','Vice-governador','Senador','Deputado Federal','Deputado Estadual','Deputado Distrital','1º Suplente','2º Suplente'];
export type CandidateFilters={uf?:string;office?:string;party?:string;q?:string;limit?:number;page?:number};
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
