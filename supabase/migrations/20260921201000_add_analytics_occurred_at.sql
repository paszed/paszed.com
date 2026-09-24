alter table analytics_events
  add column if not exists occurred_at timestamptz;

update analytics_events
set occurred_at = created_at
where occurred_at is null;

alter table analytics_events
  alter column occurred_at set default now(),
  alter column occurred_at set not null;

create index if not exists analytics_events_occurred_at_idx
  on analytics_events (occurred_at);
