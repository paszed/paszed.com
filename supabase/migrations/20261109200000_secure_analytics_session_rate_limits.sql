-- Keep internal analytics rate limits inaccessible to API clients.
ALTER TABLE public.analytics_session_rate_limits
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.analytics_session_rate_limits
  FROM anon, authenticated, PUBLIC;
