import {NextResponse} from 'next/server';
import {operationalStatus} from '@/lib/operational-status';
export const dynamic='force-dynamic';
export async function GET(){const status=await operationalStatus();return NextResponse.json(status,{status:status.databaseReachable&&status.sources.every(x=>x.ok)?200:503});}
