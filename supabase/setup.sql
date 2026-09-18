-- src/lib/db/schema.sql
create table if not exists sources (
  id text primary key, name text not null, url text not null, authority text not null,
  dataset_key text, collected_at timestamptz, updated_at timestamptz, status text default 'unknown'
);
create table if not exists source_snapshots (
  id text primary key, source_id text references sources(id), resource_id text,
  resource_name text, resource_url text, resource_format text, fingerprint text not null,
  upstream_modified_at timestamptz, collected_at timestamptz default now(), payload jsonb,
  unique(source_id, resource_id, fingerprint)
);
create table if not exists sync_runs (
  id text primary key, source_id text, started_at timestamptz default now(), finished_at timestamptz,
  status text not null, resources_seen int default 0, changes_detected int default 0, error text
);
create table if not exists change_events (
  id text primary key, source_id text, entity_type text not null, entity_key text not null,
  old_fingerprint text, new_fingerprint text not null, detected_at timestamptz default now(),
  auto_publish boolean default true, published_at timestamptz, details jsonb
);
create table if not exists candidates (id text primary key, election_year int not null, scope text not null, office text not null, ballot_name text not null, full_name text, party text, number text, registration_status text, uf text, city text, source_id text references sources(id), source_updated_at timestamptz);
create table if not exists candidate_versions (id text primary key, candidate_id text references candidates(id), fingerprint text not null, snapshot jsonb not null, valid_from timestamptz default now(), valid_to timestamptz, source_id text references sources(id));
create table if not exists proposals (id text primary key, candidate_id text references candidates(id), topic text not null, excerpt text, document_url text not null, page_number int, source_id text references sources(id), reviewed_at timestamptz);
create table if not exists polls (id text primary key, registry_number text unique, institute text, contractor text, field_start date, field_end date, sample_size int, margin_error numeric, confidence_level numeric, scope text, source_id text references sources(id));
create table if not exists finance_records (id text primary key, candidate_id text references candidates(id), kind text not null, category text, counterparty text, amount numeric not null, occurred_on date, source_id text references sources(id));
create table if not exists claims (id text primary key, claim_text text not null, speaker text, occurred_at timestamptz, origin_url text, status text default 'under_review');
create table if not exists evidence (id text primary key, claim_id text references claims(id), source_id text references sources(id), evidence_type text, excerpt text, url text not null, supports text, reviewed_at timestamptz);
create table if not exists review_queue (id text primary key, entity_type text not null, entity_id text not null, reason text not null, status text default 'pending', created_at timestamptz default now(), reviewed_at timestamptz, reviewer_note text);
create table if not exists corrections (id text primary key, entity_type text not null, entity_id text not null, summary text not null, reason text, changed_at timestamptz default now());
create index if not exists idx_snapshots_source on source_snapshots(source_id,collected_at desc);
create index if not exists idx_changes_detected on change_events(detected_at desc);
create index if not exists idx_sync_runs_started on sync_runs(started_at desc);
create index if not exists idx_polls_field_end on polls(field_end desc);
create index if not exists idx_finance_candidate_date on finance_records(candidate_id,occurred_on desc);
create index if not exists idx_finance_kind on finance_records(kind);


-- migrations/005_candidates_fields.sql
alter table candidates add column if not exists full_name text;
alter table candidates add column if not exists uf text;
alter table candidates add column if not exists city text;
create index if not exists idx_candidates_uf_office on candidates(uf,office);
create index if not exists idx_candidate_versions_candidate on candidate_versions(candidate_id,valid_from desc);


-- migrations/006_audit_integrity.sql
-- Production 06: integrity and query indexes
create index if not exists idx_candidates_uf_office on candidates(uf,office);
create index if not exists idx_candidates_party on candidates(party);
create index if not exists idx_candidate_versions_candidate on candidate_versions(candidate_id,valid_from desc);
create index if not exists idx_change_events_entity on change_events(entity_type,entity_key,detected_at desc);
create unique index if not exists uq_candidate_version_fp on candidate_versions(candidate_id,fingerprint);


-- migrations/008_release_candidate.sql
alter table candidates add column if not exists active boolean not null default true;
alter table candidates add column if not exists upstream_seen_at timestamptz;
create index if not exists idx_candidates_active_scope on candidates(active,uf,office);

-- Escritas devem ocorrer apenas no servidor com service role. Estas tabelas não precisam
-- ser expostas diretamente ao navegador; a aplicação pública usa as rotas /api.
alter table candidates enable row level security;
alter table candidate_versions enable row level security;
alter table change_events enable row level security;
alter table sync_runs enable row level security;
alter table finance_records enable row level security;
alter table polls enable row level security;
alter table claims enable row level security;
alter table evidence enable row level security;


-- migrations/009_security_release.sql
-- Voto Aberto RC2: endurecimento de leitura/escrita no Supabase.
-- A API de servidor usa service_role. Clientes públicos não devem escrever diretamente.
alter table if exists sources enable row level security;
alter table if exists source_snapshots enable row level security;
alter table if exists sync_runs enable row level security;
alter table if exists change_events enable row level security;
alter table if exists candidates enable row level security;
alter table if exists candidate_versions enable row level security;
alter table if exists proposals enable row level security;
alter table if exists polls enable row level security;
alter table if exists finance_records enable row level security;
alter table if exists claims enable row level security;
alter table if exists evidence enable row level security;
alter table if exists review_queue enable row level security;
alter table if exists corrections enable row level security;

-- A aplicação pública lê via API Next.js; não são criadas policies anon de escrita.
-- Revoke explícito reduz risco de uma policy futura permissiva por engano.
revoke insert, update, delete on table candidates from anon, authenticated;
revoke insert, update, delete on table candidate_versions from anon, authenticated;
revoke insert, update, delete on table sync_runs from anon, authenticated;
revoke insert, update, delete on table change_events from anon, authenticated;
revoke insert, update, delete on table proposals from anon, authenticated;
revoke insert, update, delete on table polls from anon, authenticated;
revoke insert, update, delete on table finance_records from anon, authenticated;
revoke insert, update, delete on table claims from anon, authenticated;
revoke insert, update, delete on table evidence from anon, authenticated;
revoke insert, update, delete on table review_queue from anon, authenticated;
revoke insert, update, delete on table corrections from anon, authenticated;


-- migrations/010_public_beta_readiness.sql
-- RC3: índices para consulta pública e auditoria de ingestão.
create index if not exists idx_candidates_public_lookup on candidates(active,election_year,uf,office,party);
create index if not exists idx_change_events_entity on change_events(entity_type,entity_key,detected_at desc);
create index if not exists idx_sources_status on sources(status,updated_at desc);
-- Escrita permanece exclusiva do backend/service_role. Não criar policies públicas de escrita.


-- migrations/011_atomic_candidate_ingest.sql
-- Execute after schema.sql and migrations 005,006,008,009,010.
begin;
alter table sync_runs add column if not exists kind text not null default 'legacy';
alter table sync_runs add column if not exists full_sync boolean not null default false;
alter table sync_runs add column if not exists records_imported integer not null default 0;
-- A -> B -> A is a legitimate history. Only an OPEN version must be unique.
drop index if exists uq_candidate_version_fp;
with ranked as (select id,row_number() over(partition by candidate_id order by valid_from desc,id desc) n from candidate_versions where valid_to is null)
update candidate_versions set valid_to=now() where id in(select id from ranked where n>1);
create unique index if not exists uq_candidate_open_version on candidate_versions(candidate_id) where valid_to is null;
create table if not exists candidate_ingest_staging(
 run_id text not null references sync_runs(id) on delete cascade,
 candidate_id text not null,payload jsonb not null,fingerprint text not null,
 primary key(run_id,candidate_id)
);
alter table candidate_ingest_staging enable row level security;
revoke all on candidate_ingest_staging from anon,authenticated;
grant all on candidate_ingest_staging to service_role;

create or replace function finalize_candidate_ingest(p_run_id text,p_expected integer,p_resource_url text,p_collected_at timestamptz,p_metadata_modified timestamptz)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare run sync_runs%rowtype; item record; old candidate_versions%rowtype; changed integer:=0; missing integer:=0; prior_count integer; n integer;
begin
 if not pg_try_advisory_xact_lock(2026,1101) then raise exception 'Outra importação está sendo publicada. Tente novamente.'; end if;
 select * into run from sync_runs where id=p_run_id for update;
 if run.id is null or run.status<>'running' or run.kind<>'candidate_ingest' then raise exception 'Execução inválida'; end if;
 if exists(select 1 from sync_runs where kind='candidate_ingest' and status='success' and started_at>run.started_at) then raise exception 'Uma coleta mais recente já foi publicada'; end if;
 select count(*) into n from candidate_ingest_staging where run_id=p_run_id;
 if p_expected<1 or n<>p_expected then raise exception 'Importação incompleta'; end if;
 select count(*) into prior_count from candidates where source_id='tse-candidatos-2026' and active;
 -- Conservative guard against silently truncated upstream exports.
 if run.full_sync and prior_count>0 and n<prior_count*0.9 then raise exception 'Queda superior a 10%% nos registros. Revisão manual necessária.'; end if;
 insert into sources(id,name,url,authority,dataset_key,collected_at,updated_at,status)
 values('tse-candidatos-2026','TSE — Candidatos 2026',p_resource_url,'Tribunal Superior Eleitoral','candidatos-2026',p_collected_at,p_metadata_modified,'ok')
 on conflict(id) do update set url=excluded.url,collected_at=excluded.collected_at,updated_at=excluded.updated_at,status='ok';
 for item in select * from candidate_ingest_staging where run_id=p_run_id loop
  select * into old from candidate_versions where candidate_id=item.candidate_id and valid_to is null;
  insert into candidates(id,election_year,scope,office,ballot_name,full_name,party,number,registration_status,uf,city,source_id,source_updated_at,upstream_seen_at,active)
  values(item.candidate_id,(item.payload->>'election_year')::int,item.payload->>'scope',item.payload->>'office',item.payload->>'ballot_name',item.payload->>'full_name',item.payload->>'party',item.payload->>'number',item.payload->>'registration_status',item.payload->>'uf',item.payload->>'city','tse-candidatos-2026',p_collected_at,p_collected_at,true)
  on conflict(id) do update set office=excluded.office,ballot_name=excluded.ballot_name,full_name=excluded.full_name,party=excluded.party,number=excluded.number,registration_status=excluded.registration_status,uf=excluded.uf,city=excluded.city,scope=excluded.scope,source_id=excluded.source_id,source_updated_at=p_collected_at,upstream_seen_at=p_collected_at,active=true;
  if old.id is null or old.fingerprint<>item.fingerprint then
   changed:=changed+1;
   update candidate_versions set valid_to=p_collected_at where id=old.id;
   insert into candidate_versions(id,candidate_id,fingerprint,snapshot,valid_from,source_id) values(gen_random_uuid()::text,item.candidate_id,item.fingerprint,item.payload->'raw',p_collected_at,'tse-candidatos-2026');
   insert into change_events(id,source_id,entity_type,entity_key,old_fingerprint,new_fingerprint,detected_at,auto_publish,published_at,details)
   values(gen_random_uuid()::text,'tse-candidatos-2026','candidate',item.candidate_id,old.fingerprint,item.fingerprint,p_collected_at,true,p_collected_at,jsonb_build_object('office',item.payload->>'office','ballot_name',item.payload->>'ballot_name','party',item.payload->>'party','status',item.payload->>'registration_status'));
  end if;
 end loop;
 if run.full_sync then
  for item in select c.id from candidates c where source_id='tse-candidatos-2026' and active and not exists(select 1 from candidate_ingest_staging s where s.run_id=p_run_id and s.candidate_id=c.id) loop
   update candidates set active=false where id=item.id;
   update candidate_versions set valid_to=p_collected_at where candidate_id=item.id and valid_to is null;
   insert into change_events(id,source_id,entity_type,entity_key,new_fingerprint,detected_at,auto_publish,published_at,details) values(gen_random_uuid()::text,'tse-candidatos-2026','candidate',item.id,'missing:'||p_collected_at,p_collected_at,true,p_collected_at,'{"event":"not_present_upstream"}');
   missing:=missing+1;
  end loop;
 end if;
 update sync_runs set status='success',finished_at=now(),resources_seen=1,changes_detected=changed+missing,records_imported=n where id=p_run_id;
 delete from candidate_ingest_staging where run_id=p_run_id;
 return jsonb_build_object('total',n,'changed',changed,'missing',missing);
end $$;
revoke all on function finalize_candidate_ingest(text,integer,text,timestamptz,timestamptz) from public,anon,authenticated;
grant execute on function finalize_candidate_ingest(text,integer,text,timestamptz,timestamptz) to service_role;
commit;


-- migrations/012_polls.sql
begin;
alter table polls add column if not exists methodology text;
alter table polls add column if not exists sampling_plan text;
alter table polls add column if not exists source_url text;
alter table polls add column if not exists collected_at timestamptz;
create or replace function publish_polls(p_rows jsonb,p_source_url text,p_started_at timestamptz)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare n integer;
begin
 if not pg_try_advisory_xact_lock(2026,1201) then raise exception 'Outra publicação de pesquisas está em execução'; end if;
 if jsonb_typeof(p_rows)<>'array' or jsonb_array_length(p_rows)<1 or jsonb_array_length(p_rows)>20000 then raise exception 'Carga inválida'; end if;
 if exists(select 1 from sync_runs where kind='poll_ingest' and status='success' and started_at>p_started_at) then raise exception 'Uma carga mais recente já foi publicada'; end if;
 insert into sources(id,name,url,authority,dataset_key,collected_at,status) values('tse-pesquisas-2026','Pesquisas eleitorais 2026',p_source_url,'TSE','pesquisas-eleitorais-2026',now(),'ok') on conflict(id) do update set url=excluded.url,collected_at=excluded.collected_at,status='ok';
 insert into polls(id,registry_number,institute,field_start,field_end,sample_size,scope,methodology,sampling_plan,source_url,collected_at,source_id)
 select id,registry_number,institute,field_start,field_end,sample_size,scope,methodology,sampling_plan,p_source_url,now(),'tse-pesquisas-2026' from jsonb_to_recordset(p_rows) as x(id text,registry_number text,institute text,field_start date,field_end date,sample_size integer,scope text,methodology text,sampling_plan text)
 on conflict(registry_number) do update set institute=excluded.institute,field_start=excluded.field_start,field_end=excluded.field_end,sample_size=excluded.sample_size,scope=excluded.scope,methodology=excluded.methodology,sampling_plan=excluded.sampling_plan,source_url=excluded.source_url,collected_at=excluded.collected_at;
 get diagnostics n=row_count;
 insert into sync_runs(id,source_id,kind,status,started_at,finished_at,records_imported) values(gen_random_uuid()::text,'tse-pesquisas-2026','poll_ingest','success',p_started_at,now(),n);
 return jsonb_build_object('total',n);
end $$;
revoke all on function publish_polls(jsonb,text,timestamptz) from public,anon,authenticated;
grant execute on function publish_polls(jsonb,text,timestamptz) to service_role;
commit;


-- migrations/013_finance.sql
begin;
alter table finance_records add column if not exists description text;
alter table finance_records add column if not exists source_sequence text;
alter table finance_records add column if not exists uf text;
alter table finance_records add column if not exists source_url text;
alter table finance_records add column if not exists collected_at timestamptz;
alter table finance_records add column if not exists filing_type text;
alter table finance_records add column if not exists filing_date text;
create table if not exists finance_ingest_staging(run_id text references sync_runs(id) on delete cascade,record_id text,payload jsonb not null,primary key(run_id,record_id));
alter table finance_ingest_staging enable row level security;
revoke all on finance_ingest_staging from anon,authenticated;
grant all on finance_ingest_staging to service_role;
create or replace function publish_finance(p_run_id text,p_expected integer,p_source_url text,p_uf text)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare n integer; run sync_runs%rowtype;
begin
 if not pg_try_advisory_xact_lock(2026,1301) then raise exception 'Outra carga financeira está em execução'; end if;
 select * into run from sync_runs where id=p_run_id for update;
 if run.id is null or run.status<>'running' or run.kind<>'finance_ingest' then raise exception 'Execução inválida'; end if;
 if exists(select 1 from sync_runs where kind='finance_ingest' and status='success' and started_at>run.started_at) then raise exception 'Uma carga financeira mais recente foi publicada'; end if;
 select count(*) into n from finance_ingest_staging where run_id=p_run_id;
 if n<>p_expected or n<1 then raise exception 'Carga financeira incompleta'; end if;
 if exists(select 1 from finance_ingest_staging s where s.run_id=p_run_id and (s.payload->>'uf'<>p_uf or not exists(select 1 from candidates c where c.id=s.payload->>'candidate_id'))) then raise exception 'Importe as candidaturas primeiro e confira a UF'; end if;
 insert into sources(id,name,url,authority,dataset_key,collected_at,status) values('tse-contas-2026','Prestação de contas 2026',p_source_url,'TSE','prestacao-de-contas-eleitorais-2026',now(),'ok') on conflict(id) do update set url=excluded.url,collected_at=now(),status='ok';
 -- Replace only the fully staged UF snapshot atomically; source lines are not transaction totals.
 delete from finance_records where source_id='tse-contas-2026' and uf=p_uf;
 insert into finance_records(description,source_sequence,id,candidate_id,kind,category,counterparty,amount,occurred_on,source_id,source_url,collected_at,uf,filing_type,filing_date)
 select payload->>'description',payload->>'source_sequence',record_id,payload->>'candidate_id',payload->>'kind',payload->>'category',payload->>'counterparty',(payload->>'amount')::numeric,(payload->>'occurred_on')::date,'tse-contas-2026',p_source_url,now(),p_uf,payload->>'filing_type',payload->>'filing_date' from finance_ingest_staging where run_id=p_run_id
 on conflict(id) do update set category=excluded.category,counterparty=excluded.counterparty,amount=excluded.amount,occurred_on=excluded.occurred_on,source_url=excluded.source_url,collected_at=excluded.collected_at,filing_type=excluded.filing_type,filing_date=excluded.filing_date;
 update sync_runs set status='success',finished_at=now(),records_imported=n where id=p_run_id;
 delete from finance_ingest_staging where run_id=p_run_id;
 return jsonb_build_object('total',n,'uf',p_uf);
end $$;
revoke all on function publish_finance(text,integer,text,text) from public,anon,authenticated;
grant execute on function publish_finance(text,integer,text,text) to service_role;
commit;


-- migrations/014_server_permissions.sql
-- Data API access is exclusively through the server-side service role.
grant usage on schema public to service_role;
grant select,insert,update,delete on sources,source_snapshots,sync_runs,change_events,candidates,candidate_versions,proposals,polls,finance_records,claims,evidence,review_queue,corrections,candidate_ingest_staging,finance_ingest_staging to service_role;
revoke all on sources,source_snapshots,sync_runs,change_events,candidates,candidate_versions,proposals,polls,finance_records,claims,evidence,review_queue,corrections,candidate_ingest_staging,finance_ingest_staging from anon,authenticated;


-- migrations/015_editorial.sql
alter table claims add column if not exists reviewed_at timestamptz;
alter table claims add column if not exists published_at timestamptz;
alter table claims add column if not exists review_summary text;
