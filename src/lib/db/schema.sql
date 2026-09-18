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
