import {dbConfigured,dbSelect} from '@/lib/supabase-rest';
import DataNotice from '@/components/DataNotice';
export const dynamic='force-dynamic';
export default async function Page(){let failed=false;const rows=dbConfigured?await dbSelect('corrections','select=*&order=changed_at.desc&limit=100').catch(()=>{failed=true;return []}):[];return <main className="page"><h1>Histórico de correções</h1><p className="lead">Correções editoriais registradas, com motivo e data.</p>{!dbConfigured?<DataNotice state="unconfigured"/>:failed?<DataNotice state="error"/>:rows.length?rows.map(r=><article className="card" key={r.id}><h2>{r.summary}</h2><p>{r.reason}</p><p>{new Date(r.changed_at).toLocaleString('pt-BR')}</p></article>):<p>Nenhuma correção publicada nesta base.</p>}</main>;}
