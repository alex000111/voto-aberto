import {NextResponse} from 'next/server';
import {getCandidateDatasetMetadata,selectResources,TSE_DATASET_URL} from '@/lib/tse';
export async function GET(){
 try{const d=await getCandidateDatasetMetadata();return NextResponse.json({ok:true,dataset:d.title,metadataModified:d.metadataModified,groups:{candidatos:selectResources(d.resources,/^Candidatos\s*CSV|Candidatos$/i),bens:selectResources(d.resources,/Bens.*CSV/i),redes:selectResources(d.resources,/Redes sociais.*CSV/i),fotos:selectResources(d.resources,/Fotos/i),propostas:selectResources(d.resources,/Proposta de governo/i)},source:TSE_DATASET_URL,checkedAt:new Date().toISOString()});}
 catch(e){return NextResponse.json({ok:false,error:'Fonte oficial temporariamente indisponível. Nenhum dado substituto foi inferido.',source:TSE_DATASET_URL,checkedAt:new Date().toISOString()},{status:503});}
}
