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
