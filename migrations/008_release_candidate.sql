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
