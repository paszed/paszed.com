create table if not exists analytics_session_rate_limits (
  session_id uuid not null,
  window_start timestamptz not null,
  event_count integer not null default 0,
  primary key (session_id, window_start)
);

create or replace function ingest_analytics_event(
  p_event jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid := (p_event ->> 'session_id')::uuid;
  v_window_start timestamptz := date_trunc('minute', now());
  v_count integer;
begin
  insert into analytics_session_rate_limits (session_id, window_start, event_count)
  values (v_session_id, v_window_start, 1)
  on conflict (session_id, window_start)
  do update set event_count = analytics_session_rate_limits.event_count + 1
  returning event_count into v_count;

  if v_count > 120 then
    return false;
  end if;

  insert into analytics_events (
    id, session_id, source, type, path, previous_path, locale, referrer,
    viewport_width, viewport_height, user_agent, traffic_class, metadata,
    occurred_at, created_at
  ) values (
    (p_event ->> 'id')::uuid,
    v_session_id,
    'browser',
    p_event ->> 'type',
    p_event ->> 'path',
    p_event ->> 'previous_path',
    p_event ->> 'locale',
    p_event ->> 'referrer',
    (p_event ->> 'viewport_width')::integer,
    (p_event ->> 'viewport_height')::integer,
    p_event ->> 'user_agent',
    p_event ->> 'traffic_class',
    p_event -> 'metadata',
    (p_event ->> 'occurred_at')::timestamptz,
    now()
  );

  return true;
end;
$$;

revoke all on function ingest_analytics_event(jsonb) from public, anon, authenticated;
grant execute on function ingest_analytics_event(jsonb) to service_role;
