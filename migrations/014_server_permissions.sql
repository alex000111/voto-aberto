-- Data API access is exclusively through the server-side service role.
grant usage on schema public to service_role;
grant select,insert,update,delete on sources,source_snapshots,sync_runs,change_events,candidates,candidate_versions,proposals,polls,finance_records,claims,evidence,review_queue,corrections,candidate_ingest_staging,finance_ingest_staging to service_role;
revoke all on sources,source_snapshots,sync_runs,change_events,candidates,candidate_versions,proposals,polls,finance_records,claims,evidence,review_queue,corrections,candidate_ingest_staging,finance_ingest_staging from anon,authenticated;
