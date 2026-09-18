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
