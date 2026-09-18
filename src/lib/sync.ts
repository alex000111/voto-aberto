import {createHash,randomUUID} from 'crypto';
import {dbConfigured,dbInsert,dbSelect,dbUpsert} from './supabase-rest';

type Catalog={key:string;id:string;name:string;authority:string;url:string;autoPublish:boolean};
export const catalogs:Catalog[]=[
 {key:'candidatos',id:'tse-candidatos-2026',name:'Candidatos 2026',authority:'TSE',url:'https://dadosabertos.tse.jus.br/api/3/action/package_show?id=candidatos-2026',autoPublish:true},
 {key:'pesquisas',id:'tse-pesquisas-2026',name:'Pesquisas Eleitorais 2026',authority:'TSE',url:'https://dadosabertos.tse.jus.br/api/3/action/package_show?id=pesquisas-eleitorais-2026',autoPublish:true},
 {key:'contas',id:'tse-contas-2026',name:'Prestação de Contas Eleitorais 2026',authority:'TSE',url:'https://dadosabertos.tse.jus.br/api/3/action/package_show?id=prestacao-de-contas-eleitorais-2026',autoPublish:true},
 {key:'processual',id:'tse-processual-2026',name:'Processual 2026',authority:'TSE',url:'https://dadosabertos.tse.jus.br/api/3/action/package_show?id=processual-2026',autoPublish:true}
];
const hash=(x:unknown)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export async function syncCatalog(c:Catalog){
 if(!dbConfigured)return {source:c.name,status:"error",error:"Banco não configurado.",database:false};
 const started=new Date().toISOString(),runId=randomUUID();
 try{
  const r=await fetch(c.url,{headers:{accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(15000)}); if(!r.ok)throw new Error(`HTTP ${r.status}`);
  const body=await r.json(); if(!body?.success)throw new Error('Catálogo retornou success=false');
  const resources=(body.result.resources||[]).map((x:any)=>({resource_id:x.id,resource_name:x.name,resource_url:x.url,resource_format:x.format||'',upstream_modified_at:x.last_modified||x.created||null,payload:{size:x.size||null,description:x.description||null,hash:x.hash||null}}));
  await dbUpsert('sources',[{id:c.id,name:c.name,url:c.url,authority:c.authority,dataset_key:c.key,collected_at:new Date().toISOString(),updated_at:body.result.metadata_modified||null,status:'ok'}]);
  let changes=0;
  for(const x of resources){
   const fp=hash({url:x.resource_url,modified:x.upstream_modified_at,size:x.payload.size,hash:x.payload.hash});
   const previous:any[]=await dbSelect('source_snapshots',`source_id=eq.${encodeURIComponent(c.id)}&resource_id=eq.${encodeURIComponent(x.resource_id)}&order=collected_at.desc&limit=1`);
   if(!previous[0]||previous[0].fingerprint!==fp){
    changes++;
    await dbUpsert('source_snapshots?on_conflict=source_id,resource_id,fingerprint',[{id:randomUUID(),source_id:c.id,...x,fingerprint:fp}]);
    await dbInsert('change_events',[{id:randomUUID(),source_id:c.id,entity_type:'resource',entity_key:x.resource_id,old_fingerprint:previous[0]?.fingerprint||null,new_fingerprint:fp,auto_publish:c.autoPublish,published_at:c.autoPublish?new Date().toISOString():null,details:{name:x.resource_name,url:x.resource_url,format:x.resource_format}}]);
   }
  }
  await dbInsert('sync_runs',[{id:runId,source_id:c.id,started_at:started,finished_at:new Date().toISOString(),status:'success',kind:'catalog',resources_seen:resources.length,changes_detected:changes}]);
  return {source:c.name,status:'success',resources:resources.length,changes,database:dbConfigured};
 }catch(e:any){
  if(dbConfigured)await dbInsert('sync_runs',[{id:runId,source_id:c.id,started_at:started,finished_at:new Date().toISOString(),status:'error',error:String(e?.message||e)}]).catch(()=>{});
  return {source:c.name,status:'error',error:String(e?.message||e),database:dbConfigured};
 }
}
export async function syncAll(){return Promise.all(catalogs.map(syncCatalog));}
