import { describe, expect, it } from "vitest";
import { detectJourneyAnomalies } from "../../../../src/analytics/journey/anomalies";
import { detectDeadEnds } from "../../../../src/analytics/journey/exits";
import type { JourneyPath } from "../../../../src/analytics/journey/path";

const journey = (routes: string[], exit?: string): JourneyPath => ({
  sessionId: "session-1",
  entry: routes[0] ?? "",
  routes,
  observedStart: false,
  observedExit: exit !== undefined,
  ...(exit === undefined ? {} : { exit }),
});

describe("detectJourneyAnomalies", () => {
  it("returns no anomalies for a short journey without repeated routes", () => {
    expect(detectJourneyAnomalies(journey(["/", "/about", "/contact"]))).toEqual([]);
  });

  it("does not flag a journey of exactly eight routes as deep", () => {
    const routes = Array.from({ length: 8 }, (_, index) => `/page-${index}`);
    expect(detectJourneyAnomalies(journey(routes))).toEqual([]);
  });

  it("flags journeys deeper than eight routes", () => {
    const routes = Array.from({ length: 9 }, (_, index) => `/page-${index}`);
    expect(detectJourneyAnomalies(journey(routes))).toEqual([
      { type: "deep_journey", path: "/page-0", routes, detail: "9 routes visited" },
    ]);
  });

  it("detects consecutive repeated routes as backtracks", () => {
    expect(detectJourneyAnomalies(journey(["/", "/"]))).toEqual([
      { type: "backtrack", path: "/", routes: ["/", "/"] },
    ]);
  });

  it("detects a longer return segment as a loop", () => {
    expect(detectJourneyAnomalies(journey(["/", "/about", "/"]))).toEqual([
      { type: "loop", path: "/", routes: ["/", "/about", "/"] },
    ]);
  });

  it("reports a route visited three times", () => {
    const routes = ["/", "/a", "/", "/b", "/"];
    expect(detectJourneyAnomalies(journey(routes))).toEqual([
      { type: "loop", path: "/", routes: ["/", "/a", "/"] },
      { type: "loop", path: "/", routes: ["/", "/b", "/"] },
      { type: "repeated_route", path: "/", routes, detail: "Visited 3 times" },
    ]);
  });
});

describe("detectDeadEnds", () => {
  it("returns no dead ends for empty input", () => {
    expect(detectDeadEnds([])).toEqual([]);
  });

  it("ignores journeys without a final route and routes with fewer than three sessions", () => {
    expect(detectDeadEnds([
      journey([]),
      journey(["/"], "/"),
      journey(["/"], "/"),
    ])).toEqual([]);
  });

  it("counts exits and sorts qualifying routes by exit rate", () => {
    const paths = [
      journey(["/a"], "/a"),
      journey(["/a"], "/a"),
      journey(["/a"], "/elsewhere"),
      journey(["/b"], "/b"),
      journey(["/b"], "/elsewhere"),
      journey(["/b"]),
      journey(["/c"], "/c"),
      journey(["/c"], "/c"),
    ];
    expect(detectDeadEnds(paths)).toEqual([
      { path: "/a", sessions: 3, exits: 2, exitRate: 2 / 3 },
      { path: "/b", sessions: 3, exits: 1, exitRate: 1 / 3 },
    ]);
  });
});
