import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { readJourneyEventsMock } = vi.hoisted(() => ({
  readJourneyEventsMock: vi.fn(),
}));

vi.mock("../journey/repository", () => ({
  readJourneyEvents: readJourneyEventsMock,
}));

import { readAnalyticsReport } from "./server";

const from = new Date("2026-09-24T00:00:00.000Z");
const to = new Date("2026-09-25T00:00:00.000Z");
describe("readAnalyticsReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([false, true])(
    "builds traffic and journey reports from the same dataset with truncated=%s",
    async (truncated) => {
      readJourneyEventsMock.mockResolvedValue({
        events: [
          {
            id: "event-1",
            sessionId: "session-1",
            source: "browser",
            type: "session_start",
            path: "/en",
            timestamp: "2026-09-24T10:00:00.000Z",
          },
          {
            id: "event-2",
            sessionId: "session-1",
            source: "browser",
            type: "page_view",
            path: "/en",
            timestamp: "2026-09-24T10:00:01.000Z",
          },
          {
            id: "event-3",
            sessionId: "session-2",
            source: "server",
            type: "page_view",
            path: "/en/projects",
            timestamp: "2026-09-24T10:00:02.000Z",
          },
        ],
        truncated,
      });

      const report = await readAnalyticsReport(from, to);

      expect(report).toEqual({
        from: from.toISOString(),
        to: to.toISOString(),
        truncated,
        traffic: {
          eventCount: 3,
          sessionCount: 2,
          pageViewCount: 2,
          eventsBySource: { browser: 2, server: 1 },
        },
        navigation: {
          routeTransitionEventCount: 0,
          backNavigationCount: 0,
          forwardNavigationCount: 0,
          externalNavigationCount: 0,
          observedRouteCount: 2,
          reconstructedTransitionCount: 0,
        },
        conversion: {
          contactCtaCount: 0,
          contactStartCount: 0,
          contactSubmitCount: 0,
          contactCtaSessionCount: 0,
          contactStartSessionCount: 0,
          contactSubmitSessionCount: 0,
        },
        discovery: {
          eventCounts: {
            offer_view: 0,
            service_view: 0,
            pricing_view: 0,
            specs_view: 0,
            capability_discovery: 0,
          },
          sessionCounts: {
            offer_view: 0,
            service_view: 0,
            pricing_view: 0,
            specs_view: 0,
            capability_discovery: 0,
          },
        },
        engagement: {
          interactionCount: 0,
          interactionSessionCount: 0,
          scrollEventCount: 0,
          scrollDepthEventCount: 0,
          dwellEventCount: 0,
          focusEventCount: 0,
          blurEventCount: 0,
          visibilityChangeCount: 0,
        },
        crawlers: {
          botRequestCount: 0,
          crawlRouteCount: 0,
          crawlErrorCount: 0,
          crawlRobotsCount: 0,
          crawlSitemapCount: 0,
          observedSessionCount: 0,
        },
        experiments: {
          experimentExposureCount: 0,
          variantExposureCount: 0,
          experimentConversionCount: 0,
          exposedSessionCount: 0,
          convertedSessionCount: 0,
        },
        performance: {
          dwellSampleCount: 0,
          observedActiveMs: 0,
          scrollDepthSampleCount: 0,
          maxObservedScrollDepth: null,
        },
        journeys: {
          sessionCount: 2,
          journeyCount: 2,
          boundaries: { observedStartCount: 1, observedExitCount: 0 },
          graph: { nodes: ["/en", "/en/projects"], transitions: [] },
          deadEnds: [],
          anomalies: [],
        },
      });

      expect(readJourneyEventsMock).toHaveBeenCalledExactlyOnceWith(from, to);
    },
  );

  it("propagates repository failures", async () => {
    readJourneyEventsMock.mockRejectedValue(new Error("Database unavailable"));

    await expect(readAnalyticsReport(from, to)).rejects.toThrow(
      "Database unavailable",
    );
  });
});
