import type { AnalyticsEvent, AnalyticsSource } from "../events/types";

export interface TrafficMetrics {
  eventCount: number;
  sessionCount: number;
  pageViewCount: number;
  eventsBySource: Record<AnalyticsSource, number>;
}

export function buildTrafficMetrics(events: AnalyticsEvent[]): TrafficMetrics {
  const sessions = new Set<string>();
  const eventsBySource: Record<AnalyticsSource, number> = {
    browser: 0,
    server: 0,
  };
  let pageViewCount = 0;

  for (const event of events) {
    sessions.add(event.sessionId);
    eventsBySource[event.source] += 1;
    if (event.type === "page_view") pageViewCount += 1;
  }

  return {
    eventCount: events.length,
    sessionCount: sessions.size,
    pageViewCount,
    eventsBySource,
  };
}
