import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildJourneyReport } from "./report";

function event(
  sessionId: string,
  type: AnalyticsEvent["type"],
  path: string,
  second: number,
): AnalyticsEvent {
  return {
    id: `${sessionId}-${second}`,
    sessionId,
    source: "browser",
    type,
    path,
    timestamp: new Date(
      Date.UTC(2026, 0, 1, 0, 0, second),
    ).toISOString(),
  };
}

describe("buildJourneyReport", () => {
  it("groups events and builds a navigation graph", () => {
    const report = buildJourneyReport([
      event("a", "page_view", "/en", 1),
      event("b", "page_view", "/en", 2),
      event("a", "route_transition", "/en/projects", 3),
      event("b", "route_transition", "/en/contact", 4),
      event("a", "exit", "/en/projects", 5),
    ]);

    expect(report.sessionCount).toBe(2);
    expect(report.journeyCount).toBe(2);
    expect(report.boundaries).toEqual({
      observedStartCount: 0,
      observedExitCount: 1,
    });

    expect(report.graph.nodes).toEqual([
      "/en",
      "/en/projects",
      "/en/contact",
    ]);

    expect(report.graph.transitions).toEqual([
      { from: "/en", to: "/en/projects", count: 1 },
      { from: "/en", to: "/en/contact", count: 1 },
    ]);

    expect(report.deadEnds).toEqual([]);
    expect(report.anomalies).toEqual([]);
  });

  it("counts sessions without navigable events separately", () => {
    const report = buildJourneyReport([
      event("a", "heartbeat", "/en", 1),
      event("b", "page_view", "/en", 2),
    ]);

    expect(report.sessionCount).toBe(2);
    expect(report.journeyCount).toBe(1);
  });

  it("reports repeated-route anomalies with their session IDs", () => {
    const report = buildJourneyReport([
      event("a", "page_view", "/en", 1),
      event("a", "route_transition", "/en/projects", 2),
      event("a", "route_transition", "/en", 3),
      event("a", "route_transition", "/en/projects", 4),
      event("a", "route_transition", "/en", 5),
    ]);

    expect(report.anomalies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sessionId: "a",
          type: "repeated_route",
          path: "/en",
        }),
      ]),
    );
  });

  it("returns an empty report for an empty event set", () => {
    expect(buildJourneyReport([])).toEqual({
      sessionCount: 0,
      journeyCount: 0,
      boundaries: { observedStartCount: 0, observedExitCount: 0 },
      graph: { nodes: [], transitions: [] },
      deadEnds: [],
      anomalies: [],
    });
  });
});

describe("journey report boundary observations", () => {
  it("counts observed starts and exits independently", () => {
    const report = buildJourneyReport([
      event("a", "session_start", "/en", 1),
      event("a", "page_view", "/en", 2),
      event("b", "page_view", "/en", 3),
      event("b", "exit", "/en", 4),
      event("c", "session_start", "/en", 5),
      event("c", "heartbeat", "/en", 6),
    ]);

    expect(report.sessionCount).toBe(3);
    expect(report.journeyCount).toBe(2);
    expect(report.boundaries).toEqual({
      observedStartCount: 1,
      observedExitCount: 1,
    });
  });
});
