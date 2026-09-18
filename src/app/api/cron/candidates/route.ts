import {adminAuthorized} from '@/lib/admin-auth';
import {dbConfigured} from '@/lib/supabase-rest';
import { NextRequest,NextResponse } from 'next/server'; import { ingestCandidates } from '@/lib/ingest-candidates';
export async function GET(req:NextRequest){const secret=process.env.CRON_SECRET;if(!adminAuthorized(req.headers.get('authorization'),secret))return NextResponse.json({error:'Não autorizado'},{status:401});if(!dbConfigured)return NextResponse.json({error:'Banco não configurado.'},{status:503});try{return NextResponse.json(await ingestCandidates());}catch(e:any){return NextResponse.json({error:'Importação não concluída. Verifique a configuração e o histórico operacional.'},{status:502});}}
