export type TSEResource={id:string;name:string;format:string;url:string;last_modified?:string|null;description?:string};
export type DatasetSummary={title:string;metadataModified?:string;resources:TSEResource[]};
const BASE='https://dadosabertos.tse.jus.br';
const CKAN=`${BASE}/api/3/action/package_show?id=candidatos-2026`;

export async function getCandidateDatasetMetadata():Promise<DatasetSummary>{
  const r=await fetch(CKAN,{signal:AbortSignal.timeout(15000),next:{revalidate:1800},headers:{accept:'application/json','User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (VotoAberto Civic Platform)'}});
  if(!r.ok) throw new Error(`TSE CKAN ${r.status}`);
  const body=await r.json();
  if(!body?.success) throw new Error('Resposta inválida do catálogo do TSE');
  return {title:body.result.title,metadataModified:body.result.metadata_modified,resources:(body.result.resources||[]).map((x:any)=>({id:x.id,name:x.name,format:x.format,url:x.url,last_modified:x.last_modified,description:x.description}))};
}
export function selectResources(resources:TSEResource[],pattern:RegExp){return resources.filter(r=>pattern.test(`${r.name} ${r.format}`));}
export function sourceStamp(url:string){return {source:'Tribunal Superior Eleitoral',sourceUrl:url,collectedAt:new Date().toISOString(),classification:'Fato documentado' as const};}
export const TSE_DATASET_URL=`${BASE}/dataset/candidatos-2026`;
