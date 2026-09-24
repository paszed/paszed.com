import { describe, expect, it } from "vitest";
import { buildTransitions } from "../../../../src/analytics/journey/transitions";
import { buildJourneyGraph } from "../../../../src/analytics/journey/graph";
import type { JourneyPath } from "../../../../src/analytics/journey/path";

const journey = (routes: string[]): JourneyPath => ({
  sessionId: "session-1",
  entry: routes[0] ?? "",
  routes,
});

describe("buildTransitions", () => {
  it("returns no transitions for empty and single-route journeys", () => {
    expect(buildTransitions([journey([]), journey(["/"])] )).toEqual([]);
  });

  it("counts repeated directed transitions independently", () => {
    expect(buildTransitions([
      journey(["/", "/about", "/"]),
      journey(["/", "/about"]),
    ])).toEqual([
      { from: "/", to: "/about", count: 2 },
      { from: "/about", to: "/", count: 1 },
    ]);
  });
});

describe("buildJourneyGraph", () => {
  it("returns empty nodes and transitions for no journeys", () => {
    expect(buildJourneyGraph([])).toEqual({ nodes: [], transitions: [] });
  });

  it("deduplicates nodes and includes counted transitions", () => {
    expect(buildJourneyGraph([
      journey(["/", "/about"]),
      journey(["/", "/contact"]),
      journey(["/", "/about"]),
    ])).toEqual({
      nodes: ["/", "/about", "/contact"],
      transitions: [
        { from: "/", to: "/about", count: 2 },
        { from: "/", to: "/contact", count: 1 },
      ],
    });
  });
});
