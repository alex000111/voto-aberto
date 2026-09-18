export type TSEResource={id:string;name:string;format:string;url:string;last_modified?:string|null;description?:string};
export type DatasetSummary={id:string;title:string;metadataModified?:string;resources:TSEResource[]};
const BASE='https://dadosabertos.tse.jus.br';
export const DATASETS={candidates:'candidatos-2026',polls:'pesquisas-eleitorais-2026',finance:'prestacao-de-contas-eleitorais-2026'} as const;
export async function getDataset(id:string):Promise<DatasetSummary>{
 const r=await fetch(`${BASE}/api/3/action/package_show?id=${encodeURIComponent(id)}`,{signal:AbortSignal.timeout(15000),next:{revalidate:1800},headers:{accept:'application/json'}});
 if(!r.ok) throw new Error(`TSE CKAN ${id}: ${r.status}`); const b=await r.json(); if(!b?.success) throw new Error(`Catálogo inválido: ${id}`);
 return {id,title:b.result.title,metadataModified:b.result.metadata_modified,resources:(b.result.resources||[]).map((x:any)=>({id:x.id,name:x.name,format:x.format,url:x.url,last_modified:x.last_modified,description:x.description}))};
}
export function findResources(ds:DatasetSummary,patterns:RegExp[]){return ds.resources.filter(r=>patterns.some(p=>p.test(`${r.name} ${r.description||''} ${r.format}`)))}
export async function getElectionDataHealth(){
 const settled=await Promise.allSettled(Object.entries(DATASETS).map(async([key,id])=>({key,dataset:await getDataset(id)})));
 return settled.map((x,i)=>x.status==='fulfilled'?{ok:true,...x.value}:{ok:false,key:Object.keys(DATASETS)[i],error:String(x.reason)});
}
