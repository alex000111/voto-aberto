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
