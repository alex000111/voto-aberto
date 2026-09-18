import {dbSelect} from './supabase-rest';
export async function listPolls(){return dbSelect('polls','select=*&order=field_end.desc&limit=100')}
export async function listFinance(){return dbSelect('finance_records','select=*&order=occurred_on.desc&limit=200')}
export async function listRecentChanges(){return dbSelect('change_events','select=*&order=detected_at.desc&limit=50')}
export function money(v:any){const n=Number(v);return Number.isFinite(n)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n):'—'}
