import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildConversionMetrics } from "./conversion";

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
    path: "/en/contact",
    timestamp: "2026-09-24T10:00:00.000Z",
  };
}

describe("buildConversionMetrics", () => {
  it("counts contact stages and distinct sessions independently", () => {
    expect(buildConversionMetrics([
      event("1", "a", "contact_cta"),
      event("2", "a", "contact_cta"),
      event("3", "a", "contact_start"),
      event("4", "a", "contact_submit"),
      event("5", "b", "contact_cta"),
      event("6", "b", "contact_start"),
      event("7", "c", "experiment_conversion"),
    ])).toEqual({
      contactCtaCount: 3,
      contactStartCount: 2,
      contactSubmitCount: 1,
      contactCtaSessionCount: 2,
      contactStartSessionCount: 2,
      contactSubmitSessionCount: 1,
    });
  });

  it("returns zero counts for an empty dataset", () => {
    expect(buildConversionMetrics([])).toEqual({
      contactCtaCount: 0,
      contactStartCount: 0,
      contactSubmitCount: 0,
      contactCtaSessionCount: 0,
      contactStartSessionCount: 0,
      contactSubmitSessionCount: 0,
    });
  });
});
