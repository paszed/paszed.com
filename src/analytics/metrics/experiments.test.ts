import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildExperimentMetrics } from "./experiments";

const event = (id: string, sessionId: string, type: AnalyticsEvent["type"]): AnalyticsEvent => ({
  id, sessionId, type, source: "browser", path: "/en", timestamp: "2026-09-24T10:00:00.000Z",
});

describe("buildExperimentMetrics", () => {
  it("keeps exposures and experiment conversions separate", () => {
    expect(buildExperimentMetrics([
      event("1", "a", "experiment_exposure"),
      event("2", "a", "variant_exposure"),
      event("3", "a", "experiment_conversion"),
      event("4", "b", "variant_exposure"),
      event("5", "c", "contact_submit"),
    ])).toEqual({
      experimentExposureCount: 1,
      variantExposureCount: 2,
      experimentConversionCount: 1,
      exposedSessionCount: 2,
      convertedSessionCount: 1,
    });
  });
});
