import {createHash,randomUUID} from 'node:crypto';
import yauzl from 'yauzl';
import iconv from 'iconv-lite';
import {parse} from 'csv-parse';
import {tseDate} from './ingest-polls';
import {UFS} from './candidate-query';
import {dbInsert,dbPatch,dbRpc,dbUpsert,requireDatabase} from './supabase-rest';
import {getDataset,DATASETS} from './datasets';
export function decimalAmount(value:string){
 const normalized=value.trim().replace(/\./g,'').replace(',','.');
 if(!/^-?\d+(?:\.\d{1,2})?$/.test(normalized))throw new Error('Valor monetário inválido na fonte.');
 return normalized;
}
export function normalizeFinance(r:Record<string,string>,kind:'receita'|'despesa'){
 const sequence=kind==='receita'?r.SQ_RECEITA:r.SQ_DESPESA;
 if(r.AA_ELEICAO!=='2026'||!/^\d+$/.test(r.SQ_CANDIDATO||'')||!sequence||!r.SQ_PRESTADOR_CONTAS)throw new Error('Formato financeiro inesperado.');
 const description=(kind==='receita'?r.DS_RECEITA:r.DS_DESPESA)||'';
 return {description,source_sequence:sequence,id:createHash('sha256').update(`2026:${kind}:${r.SQ_PRESTADOR_CONTAS}:${sequence}:${description}:${kind==='receita'?r.VR_RECEITA:r.VR_DESPESA_CONTRATADA}`).digest('hex'),candidate_id:r.SQ_CANDIDATO,kind,category:kind==='receita'?r.DS_ORIGEM_RECEITA:r.DS_ORIGEM_DESPESA,counterparty:kind==='receita'?r.NM_DOADOR:r.NM_FORNECEDOR,amount:decimalAmount(kind==='receita'?r.VR_RECEITA:r.VR_DESPESA_CONTRATADA),occurred_on:tseDate(kind==='receita'?r.DT_RECEITA:r.DT_DESPESA),uf:r.SG_UF,filing_type:r.TP_PRESTACAO_CONTAS,filing_date:r.DT_PRESTACAO_CONTAS};
}
// Read only two UF files, stream rows, and never extract ZIP paths to disk.
export async function readFinance(file:string,uf:string){
 if(!UFS.includes(uf))throw new Error('UF inválida.');
 const zip=await new Promise<yauzl.ZipFile>((resolve,reject)=>yauzl.open(file,{lazyEntries:true,autoClose:false},(e,z)=>e||!z?reject(e):resolve(z)));
 const selected=await new Promise<yauzl.Entry[]>((resolve,reject)=>{
  const entries:yauzl.Entry[]=[];let count=0;
  zip.on('error',reject);zip.on('entry',(entry:yauzl.Entry)=>{if(++count>1000){zip.close();reject(new Error('ZIP contém arquivos demais.'));return;}if(new RegExp(`^(receitas_candidatos|despesas_contratadas_candidatos)_2026_${uf}\\.csv$`,'i').test(entry.fileName))entries.push(entry);zip.readEntry();});zip.on('end',()=>resolve(entries));zip.readEntry();
 });
 try{
  if(selected.length!==2)throw new Error('O ZIP deve conter receitas e despesas contratadas da UF selecionada.');
  const records:ReturnType<typeof normalizeFinance>[]=[];const occurrences=new Map<string,number>();
  for(const entry of selected){
   if(entry.uncompressedSize>512*1024*1024)throw new Error('Arquivo financeiro excede o limite por UF.');
   const stream=await new Promise<import('node:stream').Readable>((resolve,reject)=>zip.openReadStream(entry,(e,s)=>e||!s?reject(e):resolve(s)));
   const decoded=stream.pipe(iconv.decodeStream('win1252')) as import('node:stream').Transform;
   const parser=decoded.pipe(parse({columns:true,delimiter:';',bom:true,skip_empty_lines:true,trim:true}));
   stream.on('error',e=>parser.destroy(e));decoded.on('error',e=>parser.destroy(e));
   try{for await(const row of parser){
    const item=normalizeFinance(row,entry.fileName.startsWith('receitas')?'receita':'despesa');
    if(item.uf!==uf)throw new Error('UF divergente no arquivo.');
    const occurrence=(occurrences.get(item.id)||0)+1;occurrences.set(item.id,occurrence);
    // Preserve each source line. A source sequence can describe multiple expense items.
    records.push({...item,id:`${item.id}:${occurrence}`});if(records.length>500000)throw new Error('Limite de registros por UF excedido.');
   }}finally{parser.destroy();decoded.destroy();stream.destroy();}
  }
  if(!records.length)throw new Error('Fonte financeira vazia.');return records;
 }finally{zip.close();}
}
export async function ingestFinance(file:string,uf:string){
 requireDatabase();const runId=randomUUID();
 const dataset=await getDataset(DATASETS.finance),resource=dataset.resources.find(r=>r.name==='Prestação de contas de candidatos');
 if(!resource)throw new Error('Recurso financeiro não localizado no catálogo oficial.');
 const rows=await readFinance(file,uf);
 await dbInsert('sync_runs',[{id:runId,source_id:'tse-contas-2026',kind:'finance_ingest',status:'running',started_at:new Date().toISOString()}]);
 try{for(let i=0;i<rows.length;i+=200)await dbUpsert('finance_ingest_staging',rows.slice(i,i+200).map(row=>({run_id:runId,record_id:row.id,payload:row})));
  return await dbRpc('publish_finance',{p_run_id:runId,p_expected:rows.length,p_source_url:resource.url,p_uf:uf});
 }catch(e){await dbPatch('sync_runs',`id=eq.${runId}`,{status:'error',finished_at:new Date().toISOString(),error:e instanceof Error?e.message:'Falha financeira.'}).catch(()=>{});throw e;}
}
