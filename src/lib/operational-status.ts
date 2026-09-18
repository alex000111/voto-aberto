import {dbConfigured,dbSelect} from './supabase-rest';
import {getElectionDataHealth} from './datasets';
export async function operationalStatus(){
 const datasets=await getElectionDataHealth();let databaseReachable=false,runs:any[]=[],changes:any[]=[];
 if(dbConfigured){try{[runs,changes]=await Promise.all([dbSelect('sync_runs','select=id,source_id,kind,status,full_sync,started_at,finished_at,records_imported&order=started_at.desc&limit=20'),dbSelect('change_events','select=id,entity_type,entity_key,detected_at,details&published_at=not.is.null&order=detected_at.desc&limit=20')]);databaseReachable=true;}catch{}}
 return {at:new Date().toISOString(),databaseConfigured:dbConfigured,databaseReachable,sources:datasets.map((x:any)=>({id:x.key,name:x.dataset?.title||x.key,ok:x.ok})),runs,changes};
}
