import {NextResponse} from 'next/server'; import {getElectionDataHealth} from '@/lib/datasets';
export async function GET(){try{return NextResponse.json({checkedAt:new Date().toISOString(),datasets:await getElectionDataHealth()})}catch(e:any){return NextResponse.json({error:e.message},{status:503})}}
