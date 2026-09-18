import {NextResponse} from 'next/server';
import {dbConfigured} from '@/lib/supabase-rest';
import {getCandidate} from '@/lib/candidates';
import {candidateOfficialResources} from '@/lib/candidate-resources';
import {serviceUnavailable} from '@/lib/http-errors';
export const dynamic='force-dynamic';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 if(!dbConfigured)return serviceUnavailable();
 try{const {id}=await params,c=await getCandidate(id);if(!c)return NextResponse.json({error:'Candidatura não encontrada'},{status:404});const data=await candidateOfficialResources(c.uf||c.scope);return NextResponse.json({candidateId:id,scope:c.uf||c.scope,notice:'Arquivos por circunscrição; não são documentos individuais verificados.',authority:'Tribunal Superior Eleitoral',data});}catch{return serviceUnavailable();}
}
