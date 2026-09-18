alter table claims add column if not exists reviewed_at timestamptz;
alter table claims add column if not exists published_at timestamptz;
alter table claims add column if not exists review_summary text;
