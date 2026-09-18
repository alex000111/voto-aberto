import {adminAuthorized} from '@/lib/admin-auth';
import {dbConfigured} from '@/lib/supabase-rest';
import {NextRequest,NextResponse} from 'next/server';
import {syncAll} from '@/lib/sync';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const secret=process.env.CRON_SECRET; const auth=req.headers.get('authorization');
 if(!adminAuthorized(auth,secret))return NextResponse.json({error:'unauthorized'},{status:401});if(!dbConfigured)return NextResponse.json({error:'Banco não configurado.'},{status:503});
 const results=await syncAll(); return NextResponse.json({ok:results.every(x=>x.status==='success'),at:new Date().toISOString(),results});
}
