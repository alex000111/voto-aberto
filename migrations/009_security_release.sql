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
