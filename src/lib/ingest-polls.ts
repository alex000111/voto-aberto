import {createHash} from 'node:crypto';
import {getDataset,DATASETS} from './datasets';
import {downloadOfficial,candidateCsvFiles} from './tse-download';
import {decodeTseCsv} from './csv';
import {dbRpc,requireDatabase} from './supabase-rest';
export function tseDate(value:string){
 if(!value||['#NULO#','#NE','-1','-3'].includes(value))return null;
 const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
 const sql=/^\d{4}-\d{2}-\d{2}(?: 00:00:00)?$/.test(value);
 if(!m&&!sql)throw new Error('Data inesperada no TSE.');
 const iso=m?`${m[3]}-${m[2]}-${m[1]}`:value.slice(0,10);if(new Date(iso).toISOString().slice(0,10)!==iso)throw new Error('Data inválida no TSE.');return iso;
}
export function normalizePoll(r:Record<string,string>){
 if(r.AA_ELEICAO!=='2026'||!r.NR_PROTOCOLO_REGISTRO||!r.NM_EMPRESA)throw new Error('Formato de pesquisa inesperado.');
 const size=Number(r.QT_ENTREVISTADO);
 return {id:createHash('sha256').update(`poll:2026:${r.NR_PROTOCOLO_REGISTRO}`).digest('hex'),registry_number:r.NR_PROTOCOLO_REGISTRO,institute:r.NM_EMPRESA_FANTASIA&&r.NM_EMPRESA_FANTASIA!=='#NULO#'?r.NM_EMPRESA_FANTASIA:r.NM_EMPRESA,field_start:tseDate(r.DT_INICIO_PESQUISA),field_end:tseDate(r.DT_FIM_PESQUISA),sample_size:Number.isInteger(size)&&size>0?size:null,scope:`${r.SG_UF} · ${r.NM_UE} · ${r.DS_CARGO}`,methodology:r.DS_METODOLOGIA_PESQUISA||null,sampling_plan:r.DS_PLANO_AMOSTRAL||null};
}
export async function readPolls(buffer:Buffer){
 const files=await candidateCsvFiles(buffer,/(?:^|\/)pesquisa_eleitoral_2026_[a-z]{2,6}\.csv$/i);
 const map=new Map<string,ReturnType<typeof normalizePoll>>();
 for(const file of files)for(const row of decodeTseCsv(file)){
  const poll=normalizePoll(row),previous=map.get(poll.id);
  if(previous&&JSON.stringify(previous)!==JSON.stringify(poll))throw new Error('Registros de pesquisa conflitantes; revisão necessária.');
  map.set(poll.id,poll);
 }
 if(!map.size)throw new Error('Fonte de pesquisas vazia.');return [...map.values()];
}
export async function ingestPolls(){
 requireDatabase();const startedAt=new Date().toISOString();
 const ds=await getDataset(DATASETS.polls),resource=ds.resources.find(r=>/^pesquisas eleitorais$/i.test(r.name));
 if(!resource)throw new Error('Recurso de pesquisas não localizado.');
 const rows=await readPolls(await downloadOfficial(resource.url));
 return dbRpc('publish_polls',{p_rows:rows,p_source_url:resource.url,p_started_at:startedAt});
}
