import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';

test('migrations and atomic imports: rollback, idempotency, reverted values, partial scope, and access',async()=>{
 const db=new PGlite();
 try{
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(readFileSync('src/lib/db/schema.sql','utf8'));
  const migrations=readdirSync('migrations').sort();
  for(const name of migrations)await db.exec(readFileSync(`migrations/${name}`,'utf8'));
  // Verify migration reapplication is safe as well.
  for(const name of migrations)await db.exec(readFileSync(`migrations/${name}`,'utf8'));
  let sequence=0;
  const stage=async(id:string,party:string,full=false,extra=false)=>{
   const started=`2026-09-18T12:${String(++sequence).padStart(2,'0')}:00Z`;
   await db.query("insert into sync_runs(id,status,kind,full_sync,started_at) values($1,'running','candidate_ingest',$2,$3)",[id,full,started]);
   const payload={id:'123',election_year:2026,scope:'PE',office:'GOVERNADOR',ballot_name:'Exemplo',party,uf:'PE',raw:{SG_PARTIDO:party}};
   await db.query('insert into candidate_ingest_staging values($1,$2,$3,$4)',[id,'123',JSON.stringify(payload),party]);
   if(extra)await db.query('insert into candidate_ingest_staging values($1,$2,$3,$4)',[id,'456',JSON.stringify({...payload,id:'456'}),party]);
  };
  const finish=(id:string,n=1)=>db.query("select finalize_candidate_ingest($1,$2,'https://cdn.tse.jus.br/test.zip',now(),null) result",[id,n]);
  await stage('one','A',true);await finish('one');
  await stage('same','A');await finish('same');
  assert.equal((await db.query('select * from candidate_versions')).rows.length,1);
  await stage('two','B');await finish('two');
  await stage('three','A');await finish('three');
  assert.equal((await db.query('select * from candidate_versions')).rows.length,3);
  assert.equal((await db.query('select * from candidate_versions where valid_to is null')).rows.length,1);
  await stage('bad','C');await assert.rejects(finish('bad',2));
  assert.equal((await db.query<{party:string}>('select party from candidates')).rows[0].party,'A');
  await stage('extra','A',false,true);await finish('extra',2);
  await stage('partial','A');await finish('partial');
  assert.equal((await db.query('select * from candidates where active')).rows.length,2);
  await stage('truncated','A',true);await assert.rejects(finish('truncated'));
  // An old overlapping job must never overwrite a newer successful import.
  await stage('old','OLD');await stage('new','NEW');await finish('new');await assert.rejects(finish('old'));
  const polls=[{id:'poll-1',registry_number:'PE-123/2026',institute:'Example',field_start:'2026-09-01',field_end:'2026-09-02',sample_size:500,scope:'PE'}];
  await db.query("select publish_polls($1,'https://cdn.tse.jus.br/polls.zip',now())",[JSON.stringify(polls)]);
  assert.equal((await db.query('select * from polls')).rows.length,1);
  await assert.rejects(db.query("select publish_polls($1,'https://cdn.tse.jus.br/polls.zip',now())",[JSON.stringify([...polls,{id:'bad',registry_number:'PE-BAD',field_start:'invalid'}])]));
  assert.equal((await db.query('select * from polls')).rows.length,1);
  await db.query("insert into sync_runs(id,kind,status) values('finance','finance_ingest','running')");
  await db.query("insert into finance_ingest_staging values('finance','f1',$1)",[JSON.stringify({candidate_id:'123',kind:'receita',amount:'100.25',uf:'PE'})]);
  await db.query("select publish_finance('finance',1,'https://cdn.tse.jus.br/finance.zip','PE')");
  assert.equal((await db.query<{amount:string}>('select amount::text from finance_records')).rows[0].amount,'100.25');
  await db.exec('set role service_role');
  assert.equal((await db.query('select * from polls')).rows.length,1);
  await db.exec('reset role');
  await db.exec('set role anon');
  await assert.rejects(finish('bad'));
  await assert.rejects(db.query('select * from candidate_ingest_staging'));
  await db.exec('reset role');
 }finally{await db.close();}
});
