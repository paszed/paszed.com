import "server-only";

import { supabase } from "@/lib/supabase/server";
import type { AnalyticsEvent } from "../events/types";

interface AnalyticsEventRow {
  id: string;
  session_id: string;
  source: AnalyticsEvent["source"];
  type: AnalyticsEvent["type"];
  path: string;
  previous_path: string | null;
  occurred_at: string;
  metadata: Record<string, unknown> | null;
}

const PAGE_SIZE = 1_000;
const MAX_EVENTS = 10_000;

export async function readJourneyEvents(
  from: Date,
  to: Date,
): Promise<{ events: AnalyticsEvent[]; truncated: boolean }> {
  if (
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from >= to
  ) {
    throw new RangeError("Invalid analytics time window");
  }

  const events: AnalyticsEvent[] = [];

  for (let offset = 0; offset <= MAX_EVENTS; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("analytics_events")
      .select(
        "id, session_id, source, type, path, previous_path, occurred_at, metadata",
      )
      .gte("occurred_at", from.toISOString())
      .lt("occurred_at", to.toISOString())
      .order("occurred_at", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, Math.min(offset + PAGE_SIZE - 1, MAX_EVENTS));

    if (error) {
      throw new Error("Failed to read analytics events", { cause: error });
    }

    const rows = (data ?? []) as AnalyticsEventRow[];

    for (const row of rows.slice(0, MAX_EVENTS - events.length)) {
      events.push({
        id: row.id,
        sessionId: row.session_id,
        source: row.source,
        type: row.type,
        path: row.path,
        ...(row.previous_path === null
          ? {}
          : { previousPath: row.previous_path }),
        timestamp: row.occurred_at,
        ...(row.metadata ? { context: { metadata: row.metadata } } : {}),
      });
    }

    if (offset === MAX_EVENTS) {
      return { events, truncated: rows.length > 0 };
    }

    if (rows.length < PAGE_SIZE) break;
  }

  return { events, truncated: false };
}
