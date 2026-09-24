import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildCrawlerMetrics } from "./crawlers";

function event(
  id: string,
  sessionId: string,
  type: AnalyticsEvent["type"],
): AnalyticsEvent {
  return {
    id,
    sessionId,
    source: "server",
    type,
    path: "/en",
    timestamp: "2026-09-24T10:00:00.000Z",
  };
}

describe("buildCrawlerMetrics", () => {
  it("counts crawler events and their distinct session IDs", () => {
    expect(buildCrawlerMetrics([
      event("1", "a", "bot_request"),
      event("2", "a", "crawl_route"),
      event("3", "b", "crawl_error"),
      event("4", "b", "crawl_robots"),
      event("5", "b", "crawl_sitemap"),
      event("6", "c", "page_view"),
    ])).toEqual({
      botRequestCount: 1,
      crawlRouteCount: 1,
      crawlErrorCount: 1,
      crawlRobotsCount: 1,
      crawlSitemapCount: 1,
      observedSessionCount: 2,
    });
  });

  it("returns zero counts for an empty dataset", () => {
    expect(buildCrawlerMetrics([])).toEqual({
      botRequestCount: 0,
      crawlRouteCount: 0,
      crawlErrorCount: 0,
      crawlRobotsCount: 0,
      crawlSitemapCount: 0,
      observedSessionCount: 0,
    });
  });
});
