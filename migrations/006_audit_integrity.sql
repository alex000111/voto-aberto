-- Production 06: integrity and query indexes
create index if not exists idx_candidates_uf_office on candidates(uf,office);
create index if not exists idx_candidates_party on candidates(party);
create index if not exists idx_candidate_versions_candidate on candidate_versions(candidate_id,valid_from desc);
create index if not exists idx_change_events_entity on change_events(entity_type,entity_key,detected_at desc);
create unique index if not exists uq_candidate_version_fp on candidate_versions(candidate_id,fingerprint);
