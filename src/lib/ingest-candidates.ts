import crypto from 'node:crypto';
import {candidateFingerprint,normalizeCandidate} from './candidate-normalizer';
import {dbInsert,dbPatch,dbUpsert,dbRpc,requireDatabase} from './supabase-rest';
import {getCandidateDatasetMetadata,TSEResource} from './tse';
import {downloadOfficial,readCandidateRows} from './tse-download';
const SOURCE='tse-candidatos-2026';
export function selectCandidateResource(resources:TSEResource[]){
 return resources.find(r=>/consulta_cand_2026\.(zip|csv)(?:\?|$)/i.test(r.url)) || resources.find(r=>/^candidatos$/i.test(r.name.trim())&&['CSV','ZIP'].includes(r.format.toUpperCase()));
}
export async function ingestCandidates({uf,office,limit}:{uf?:string;office?:string;limit?:number}={}){
 requireDatabase();
 const runId=crypto.randomUUID(),startedAt=new Date().toISOString();
 await dbInsert('sync_runs',[{id:runId,source_id:SOURCE,started_at:startedAt,status:'running',kind:'candidate_ingest',full_sync:!uf&&!office&&!limit}]);
 try{
  const meta=await getCandidateDatasetMetadata(),resource=selectCandidateResource(meta.resources);
  if(!resource)throw new Error('Recurso principal de candidaturas não localizado.');
  const input=await readCandidateRows(await downloadOfficial(resource.url));
  const collectedAt=new Date().toISOString();
  const unique=new Map<string,ReturnType<typeof normalizeCandidate>>();
  for(const r of input){const c=normalizeCandidate(r,collectedAt),previous=unique.get(c.id);if(previous&&candidateFingerprint(previous)!==candidateFingerprint(c))throw new Error('Registros conflitantes na fonte. Importação cancelada.');unique.set(c.id,c);}
  let rows=[...unique.values()];
  if(uf)rows=rows.filter(r=>r.uf.toUpperCase()===uf.toUpperCase());
  if(office)rows=rows.filter(r=>r.office.toUpperCase()===office.toUpperCase());
  if(limit)rows=rows.slice(0,limit);
  if(!rows.length)throw new Error('Nenhum registro válido selecionado. Nenhum dado foi publicado.');
  for(let i=0;i<rows.length;i+=200){await dbUpsert('candidate_ingest_staging',rows.slice(i,i+200).map(c=>({run_id:runId,candidate_id:c.id,payload:c,fingerprint:candidateFingerprint(c)})));}
  // Promotion, history, events and run status are committed in ONE database transaction.
  const result=await dbRpc('finalize_candidate_ingest',{p_run_id:runId,p_expected:rows.length,p_resource_url:resource.url,p_collected_at:collectedAt,p_metadata_modified:meta.metadataModified||null});
  return {runId,resource:{id:resource.id,name:resource.name,url:resource.url},collectedAt,...result};
 }catch(e){
  await dbPatch('sync_runs',`id=eq.${runId}`,{finished_at:new Date().toISOString(),status:'error',error:e instanceof Error?e.message:'Falha na importação.'}).catch(()=>{});
  throw e;
 }
}
