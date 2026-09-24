import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildTrafficMetrics } from "./traffic";

function event(
  id: string,
  sessionId: string,
  source: AnalyticsEvent["source"],
  type: AnalyticsEvent["type"],
): AnalyticsEvent {
  return {
    id,
    sessionId,
    source,
    type,
    path: "/en",
    timestamp: "2026-01-01T00:00:00.000Z",
  };
}

describe("buildTrafficMetrics", () => {
  it("aggregates events, sessions, page views, and sources", () => {
    expect(buildTrafficMetrics([
      event("1", "a", "browser", "page_view"),
      event("2", "a", "browser", "heartbeat"),
      event("3", "b", "server", "page_view"),
    ])).toEqual({
      eventCount: 3,
      sessionCount: 2,
      pageViewCount: 2,
      eventsBySource: { browser: 2, server: 1 },
    });
  });

  it("returns zero counts for an empty dataset", () => {
    expect(buildTrafficMetrics([])).toEqual({
      eventCount: 0,
      sessionCount: 0,
      pageViewCount: 0,
      eventsBySource: { browser: 0, server: 0 },
    });
  });
});
