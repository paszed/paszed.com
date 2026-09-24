import { describe, expect, it } from "vitest";
import { buildJourneyPath } from "../../../../src/analytics/journey/path";
import { groupEventsBySession } from "../../../../src/analytics/journey/session";
import type { AnalyticsEvent } from "../../../../src/analytics/events/types";

const event = (
  sessionId: string,
  type: AnalyticsEvent["type"],
  path: string,
  timestamp: string,
): AnalyticsEvent => ({ sessionId, type, path, timestamp }) as AnalyticsEvent;

describe("buildJourneyPath", () => {
  it("returns null for empty input", () => {
    expect(buildJourneyPath([])).toBeNull();
  });

  it("returns null when there are no route visits", () => {
    expect(buildJourneyPath([
      event("s1", "exit", "/exit", "2026-01-01T00:00:00.000Z"),
    ])).toBeNull();
  });

  it("sorts events, removes consecutive duplicate routes, and uses the last exit", () => {
    const events = [
      event("s1", "exit", "/old-exit", "2026-01-01T00:00:05.000Z"),
      event("s1", "route_transition", "/about", "2026-01-01T00:00:03.000Z"),
      event("s1", "page_view", "/", "2026-01-01T00:00:01.000Z"),
      event("s1", "page_view", "/", "2026-01-01T00:00:02.000Z"),
      event("s1", "exit", "/about", "2026-01-01T00:00:06.000Z"),
    ];

    expect(buildJourneyPath(events)).toEqual({
      sessionId: "s1",
      entry: "/",
      routes: ["/", "/about"],
      exit: "/about",
      observedStart: false,
      observedExit: true,
    });
    expect(events[0].path).toBe("/old-exit");
  });

  it("omits the exit value when no exit event exists", () => {
    expect(buildJourneyPath([
      event("s1", "page_view", "/", "2026-01-01T00:00:00.000Z"),
    ])).toEqual({
      sessionId: "s1",
      entry: "/",
      routes: ["/"],
      exit: undefined,
      observedStart: false,
      observedExit: false,
    });
  });
});

describe("groupEventsBySession", () => {
  it("returns an empty map for empty input", () => {
    expect(groupEventsBySession([]).size).toBe(0);
  });

  it("groups events by session and sorts each group chronologically", () => {
    const later = event("s1", "page_view", "/later", "2026-01-01T00:00:03.000Z");
    const other = event("s2", "page_view", "/other", "2026-01-01T00:00:02.000Z");
    const earlier = event("s1", "page_view", "/earlier", "2026-01-01T00:00:01.000Z");
    const result = groupEventsBySession([later, other, earlier]);

    expect([...result.keys()]).toEqual(["s1", "s2"]);
    expect(result.get("s1")).toEqual([earlier, later]);
    expect(result.get("s2")).toEqual([other]);
  });
});
