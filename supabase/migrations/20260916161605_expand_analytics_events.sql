alter table analytics_events
  add column source text not null default 'browser',
  add column locale text,
  add column referrer text,
  add column viewport_width integer,
  add column viewport_height integer,
  add column user_agent text,
  add column traffic_class text;
