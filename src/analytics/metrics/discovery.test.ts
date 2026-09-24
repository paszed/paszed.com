import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildDiscoveryMetrics } from "./discovery";

function event(
  id: string,
  sessionId: string,
  type: AnalyticsEvent["type"],
): AnalyticsEvent {
  return {
    id,
    sessionId,
    source: "browser",
    type,
    path: "/en",
    timestamp: "2026-09-24T10:00:00.000Z",
  };
}

describe("buildDiscoveryMetrics", () => {
  it("counts discovery events and distinct sessions by type", () => {
    expect(buildDiscoveryMetrics([
      event("1", "a", "offer_view"),
      event("2", "a", "offer_view"),
      event("3", "b", "offer_view"),
      event("4", "a", "pricing_view"),
      event("5", "c", "capability_discovery"),
      event("6", "c", "contact_submit"),
    ])).toEqual({
      eventCounts: {
        offer_view: 3,
        service_view: 0,
        pricing_view: 1,
        specs_view: 0,
        capability_discovery: 1,
      },
      sessionCounts: {
        offer_view: 2,
        service_view: 0,
        pricing_view: 1,
        specs_view: 0,
        capability_discovery: 1,
      },
    });
  });
});
