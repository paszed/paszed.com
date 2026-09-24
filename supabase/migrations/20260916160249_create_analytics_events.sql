create table analytics_events (
  id uuid primary key,
  session_id uuid not null,
  type text not null,
  path text not null,
  previous_path text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_session_id_idx on analytics_events (session_id);
create index analytics_events_created_at_idx on analytics_events (created_at);
create index analytics_events_path_idx on analytics_events (path);
create index analytics_events_type_idx on analytics_events (type);
