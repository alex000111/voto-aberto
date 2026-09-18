import {NextResponse} from 'next/server';
import {dbConfigured,dbSelect} from '@/lib/supabase-rest';
import {environmentReady} from '@/lib/env';
export const dynamic='force-dynamic';
export async function GET(){
 let reachable=false,lastRun:any=null;
 if(dbConfigured){try{await dbSelect('candidate_ingest_staging','select=run_id&limit=1');const runs=await dbSelect('sync_runs','select=status,finished_at,records_imported,full_sync&kind=eq.candidate_ingest&full_sync=eq.true&order=started_at.desc&limit=1');lastRun=runs[0]||null;reachable=true;}catch{}}
 const age=lastRun?.finished_at?Date.now()-Date.parse(lastRun.finished_at):Infinity;
 const checks={environment:{ok:environmentReady()},database:{ok:reachable},candidateSync:{ok:lastRun?.status==='success'&&lastRun.records_imported>0&&age>=0&&age<24*60*60*1000,lastRun}};
 const ready=checks.environment.ok&&checks.database.ok&&checks.candidateSync.ok;
 return NextResponse.json({service:'voto-aberto',release:'0.11.0-rc.4',scope:'candidate-data',ready,checkedAt:new Date().toISOString(),checks},{status:ready?200:503});
}
