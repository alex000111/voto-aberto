-- RC3: índices para consulta pública e auditoria de ingestão.
create index if not exists idx_candidates_public_lookup on candidates(active,election_year,uf,office,party);
create index if not exists idx_change_events_entity on change_events(entity_type,entity_key,detected_at desc);
create index if not exists idx_sources_status on sources(status,updated_at desc);
-- Escrita permanece exclusiva do backend/service_role. Não criar policies públicas de escrita.
