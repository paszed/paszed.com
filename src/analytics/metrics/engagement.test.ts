import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildEngagementMetrics } from "./engagement";

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

describe("buildEngagementMetrics", () => {
  it("counts interaction sessions separately from interaction events", () => {
    expect(buildEngagementMetrics([
      event("1", "a", "click"),
      event("2", "a", "project_open"),
      event("3", "b", "download"),
      event("4", "b", "scroll"),
      event("5", "b", "scroll_depth"),
      event("6", "a", "dwell"),
      event("7", "a", "focus"),
      event("8", "a", "blur"),
      event("9", "a", "visibility_change"),
      event("10", "c", "page_view"),
    ])).toEqual({
      interactionCount: 3,
      interactionSessionCount: 2,
      scrollEventCount: 1,
      scrollDepthEventCount: 1,
      dwellEventCount: 1,
      focusEventCount: 1,
      blurEventCount: 1,
      visibilityChangeCount: 1,
    });
  });

  it("returns zero counts for an empty dataset", () => {
    expect(buildEngagementMetrics([])).toEqual({
      interactionCount: 0,
      interactionSessionCount: 0,
      scrollEventCount: 0,
      scrollDepthEventCount: 0,
      dwellEventCount: 0,
      focusEventCount: 0,
      blurEventCount: 0,
      visibilityChangeCount: 0,
    });
  });
});
