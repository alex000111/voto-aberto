const url=process.env.SUPABASE_URL?.replace(/\/$/,'');
const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
export const dbConfigured=Boolean(url&&key);
export function requireDatabase(){if(!dbConfigured)throw new Error('Banco ainda não configurado.');}
async function request(path:string,init:RequestInit={}){
 requireDatabase();
 const authorization:Record<string,string>=key?.startsWith('eyJ')?{Authorization:`Bearer ${key}`} : {};
 const response=await fetch(`${url}/rest/v1/${path}`,{...init,cache:'no-store',signal:AbortSignal.timeout(60000),headers:{apikey:key!,...authorization,'Content-Type':'application/json',...init.headers}});
 if(!response.ok)throw new Error(`Falha no banco (HTTP ${response.status}). Verifique configuração e migrações.`);
 const text=await response.text();return text?JSON.parse(text):null;
}
export async function dbSelect(table:string,query=''){return await request(`${table}?${query}`) as any[];}
export async function dbUpsert(table:string,rows:unknown[]){return request(table,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(rows)});}
export async function dbInsert(table:string,rows:unknown[]){return request(table,{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(rows)});}
export async function dbPatch(table:string,query:string,row:unknown){return request(`${table}?${query}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(row)});}
export async function dbRpc(name:string,args:unknown){return request(`rpc/${name}`,{method:'POST',body:JSON.stringify(args)});}
