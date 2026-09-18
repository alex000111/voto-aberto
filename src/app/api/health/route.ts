import {NextResponse} from 'next/server';
import {dbConfigured,dbSelect} from '@/lib/supabase-rest';
import {environmentChecks,environmentReady} from '@/lib/env';
export const dynamic='force-dynamic';
export async function GET(){
 let reachable=false;if(dbConfigured){try{await dbSelect('sources','select=id&limit=1');reachable=true;}catch{}}
 const ok=environmentReady()&&reachable;
 return NextResponse.json({service:'voto-aberto',release:'0.11.0-rc.4',ok,checkedAt:new Date().toISOString(),database:{configured:dbConfigured,reachable},environment:environmentChecks()},{status:ok?200:503});
}
