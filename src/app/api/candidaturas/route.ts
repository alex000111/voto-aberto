import {NextRequest,NextResponse} from 'next/server';
import {dbConfigured,dbSelect} from '@/lib/supabase-rest';
import {candidateQuery} from '@/lib/candidate-query';
import {serviceUnavailable} from '@/lib/http-errors';
export async function GET(req:NextRequest){
 if(!dbConfigured)return serviceUnavailable();
 const s=req.nextUrl.searchParams;let parsed;
 try{parsed=candidateQuery({uf:s.get('uf')||undefined,office:s.get('cargo')||s.get('office')||undefined,party:s.get('party')||undefined,q:s.get('q')||undefined,page:Number(s.get('page'))||1,limit:Number(s.get('limit'))||24});}catch{return NextResponse.json({error:'Filtros inválidos.'},{status:400});}
 try{const rows=await dbSelect('candidates',parsed.query);return NextResponse.json({configured:true,page:parsed.page,pageSize:parsed.size,hasMore:rows.length>parsed.size,data:rows.slice(0,parsed.size)});}catch{return serviceUnavailable();}
}
