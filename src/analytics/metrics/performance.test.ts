import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildPerformanceMetrics } from "./performance";

const event = (
  id: string,
  sessionId: string,
  type: AnalyticsEvent["type"],
  metadata: Record<string, unknown>,
): AnalyticsEvent => ({
  id, sessionId, type, source: "browser", path: "/en",
  timestamp: "2026-09-24T10:00:00.000Z", context: { metadata },
});

describe("buildPerformanceMetrics", () => {
  it("uses the maximum cumulative dwell sample per session and path", () => {
    expect(buildPerformanceMetrics([
      event("1", "a", "dwell", { activeMs: 15000 }),
      event("2", "a", "dwell", { activeMs: 30000 }),
      event("3", "b", "dwell", { activeMs: 12000 }),
      event("4", "a", "scroll_depth", { depth: 25 }),
      event("5", "a", "scroll_depth", { depth: 75 }),
      event("6", "a", "dwell", { activeMs: -10 }),
    ])).toEqual({
      dwellSampleCount: 3,
      observedActiveMs: 42000,
      scrollDepthSampleCount: 2,
      maxObservedScrollDepth: 75,
    });
  });

  it("returns no measured scroll depth for an empty dataset", () => {
    expect(buildPerformanceMetrics([])).toEqual({
      dwellSampleCount: 0,
      observedActiveMs: 0,
      scrollDepthSampleCount: 0,
      maxObservedScrollDepth: null,
    });
  });
});

describe("buildPerformanceMetrics scroll-depth validation", () => {
  it("rejects invalid depths and accepts both boundaries", () => {
    const events = [
      event("1", "a", "scroll_depth", {}),
      event("2", "a", "scroll_depth", { depth: "50" }),
      event("3", "a", "scroll_depth", { depth: NaN }),
      event("4", "a", "scroll_depth", { depth: Infinity }),
      event("5", "a", "scroll_depth", { depth: -1 }),
      event("6", "a", "scroll_depth", { depth: 101 }),
      event("7", "a", "scroll_depth", { depth: 0 }),
      event("8", "a", "scroll_depth", { depth: 100 }),
    ];

    expect(buildPerformanceMetrics(events)).toEqual({
      dwellSampleCount: 0,
      observedActiveMs: 0,
      scrollDepthSampleCount: 2,
      maxObservedScrollDepth: 100,
    });
  });
});
