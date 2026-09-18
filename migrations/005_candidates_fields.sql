alter table candidates add column if not exists full_name text;
alter table candidates add column if not exists uf text;
alter table candidates add column if not exists city text;
create index if not exists idx_candidates_uf_office on candidates(uf,office);
create index if not exists idx_candidate_versions_candidate on candidate_versions(candidate_id,valid_from desc);
