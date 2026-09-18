import {NextResponse} from 'next/server';
export function serviceUnavailable(){return NextResponse.json({error:'Dados temporariamente indisponíveis. Tente novamente mais tarde.'},{status:503});}
