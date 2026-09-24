import { normalizeReferrer } from "./referrer";
import { supabase } from "@/lib/supabase/server";
import type { AnalyticsContext, AnalyticsEventType } from "../events/types";

interface ServerTrackEventInput {
  type: AnalyticsEventType;
  path: string;
  previousPath?: string;
  context?: AnalyticsContext;
}

export async function trackServer(event: ServerTrackEventInput): Promise<void> {
  const { error } = await supabase.from("analytics_events").insert({
    id: crypto.randomUUID(),
    session_id: crypto.randomUUID(),
    source: "server",
    type: event.type,
    path: event.path,
    previous_path: event.previousPath ?? null,
    locale: event.context?.locale ?? null,
    referrer: normalizeReferrer(event.context?.referrer),
    viewport_width: event.context?.viewport?.width ?? null,
    viewport_height: event.context?.viewport?.height ?? null,
    user_agent: event.context?.userAgent ?? null,
    traffic_class: event.context?.trafficClass ?? null,
    metadata: event.context?.metadata ?? null,
    occurred_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[analytics:server]", error);
  }
}
