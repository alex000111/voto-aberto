import crypto from 'node:crypto';
import { keyOf, norm } from './csv';

export type CandidateRecord={id:string;election_year:number;scope:string;office:string;ballot_name:string;full_name:string;party:string;number:string;registration_status:string;uf:string;city:string|null;source_updated_at:string;raw:Record<string,string>};
export function normalizeCandidate(r:Record<string,string>,collectedAt:string):CandidateRecord{
  const id=keyOf(r,'SQ_CANDIDATO','SQ_CANDIDATO_ORIGEM') || crypto.createHash('sha256').update(JSON.stringify(r)).digest('hex').slice(0,24);
  const uf=keyOf(r,'SG_UF','SG_UE');
  const office=keyOf(r,'DS_CARGO');
  return {id,election_year:Number(keyOf(r,'ANO_ELEICAO')||2026),scope:uf==='BR'?'BRASIL':uf,office,ballot_name:keyOf(r,'NM_URNA_CANDIDATO','NM_CANDIDATO'),full_name:keyOf(r,'NM_CANDIDATO'),party:keyOf(r,'SG_PARTIDO'),number:keyOf(r,'NR_CANDIDATO'),registration_status:keyOf(r,'DS_SITUACAO_CANDIDATURA','DS_SITUACAO_CANDIDATO_URNA'),uf,city:norm(r.NM_UE)||null,source_updated_at:collectedAt,raw:Object.fromEntries(['SQ_CANDIDATO','ANO_ELEICAO','SG_UF','DS_CARGO','NM_URNA_CANDIDATO','NM_CANDIDATO','SG_PARTIDO','NR_CANDIDATO','DS_SITUACAO_CANDIDATURA','DS_SITUACAO_CANDIDATO_URNA','NM_UE'].map(key=>[key,norm(r[key])]))};
}
export function candidateFingerprint(c:CandidateRecord){return crypto.createHash('sha256').update(JSON.stringify(c.raw)).digest('hex');}
