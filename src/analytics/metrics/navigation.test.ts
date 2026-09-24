import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildJourneyReport } from "../journey/report";
import { buildNavigationMetrics } from "./navigation";

function event(
  id: string,
  type: AnalyticsEvent["type"],
  path: string,
): AnalyticsEvent {
  return {
    id,
    sessionId: "session-1",
    source: "browser",
    type,
    path,
    timestamp: `2026-01-01T00:00:${id.padStart(2, "0")}.000Z`,
  };
}

describe("buildNavigationMetrics", () => {
  it("counts recorded navigation and reconstructed transitions separately", () => {
    const events = [
      event("1", "page_view", "/en"),
      event("2", "route_transition", "/en/projects"),
      event("3", "back_navigation", "/en"),
      event("4", "forward_navigation", "/en/projects"),
      event("5", "external_navigation", "/en/projects"),
    ];
    const journeys = buildJourneyReport(events);

    expect(buildNavigationMetrics(events, journeys)).toEqual({
      routeTransitionEventCount: 1,
      backNavigationCount: 1,
      forwardNavigationCount: 1,
      externalNavigationCount: 1,
      observedRouteCount: 2,
      reconstructedTransitionCount: 1,
    });
  });

  it("returns zero counts for an empty dataset", () => {
    const events: AnalyticsEvent[] = [];

    expect(buildNavigationMetrics(events, buildJourneyReport(events))).toEqual({
      routeTransitionEventCount: 0,
      backNavigationCount: 0,
      forwardNavigationCount: 0,
      externalNavigationCount: 0,
      observedRouteCount: 0,
      reconstructedTransitionCount: 0,
    });
  });
});
