import {NextResponse} from 'next/server';
import {dbSelect} from '@/lib/supabase-rest';
import {serviceUnavailable} from '@/lib/http-errors';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;const c=await dbSelect('candidates',`id=eq.${encodeURIComponent(id)}&limit=1`);if(!c[0])return NextResponse.json({error:'Candidatura não encontrada'},{status:404});const history=await dbSelect('candidate_versions',`select=id,fingerprint,valid_from,valid_to,source_id&candidate_id=eq.${encodeURIComponent(id)}&order=valid_from.desc&limit=25`);return NextResponse.json({candidate:c[0],history});}catch{return serviceUnavailable();}
}
