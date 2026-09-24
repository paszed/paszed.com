import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../events/types";
import { buildJourneyPath } from "./path";

function event(type: AnalyticsEvent["type"], path: string, second: number): AnalyticsEvent {
  return {
    id: `event-${second}`,
    sessionId: "session-1",
    source: "browser",
    type,
    path,
    timestamp: new Date(Date.UTC(2026, 0, 1, 0, 0, second)).toISOString(),
  };
}

describe("buildJourneyPath boundaries", () => {
  it("records observed start and exit events", () => {
    expect(buildJourneyPath([
      event("session_start", "/en", 1),
      event("page_view", "/en", 2),
      event("exit", "/en", 3),
    ])).toEqual({
      sessionId: "session-1",
      entry: "/en",
      routes: ["/en"],
      exit: "/en",
      observedStart: true,
      observedExit: true,
    });
  });

  it("does not infer boundaries from a partial event window", () => {
    expect(buildJourneyPath([
      event("session_resume", "/en", 1),
      event("page_view", "/en", 2),
      event("route_transition", "/en/projects", 3),
    ])).toEqual({
      sessionId: "session-1",
      entry: "/en",
      routes: ["/en", "/en/projects"],
      exit: undefined,
      observedStart: false,
      observedExit: false,
    });
  });

  it("returns null when no navigation events are present", () => {
    expect(buildJourneyPath([
      event("session_start", "/en", 1),
      event("heartbeat", "/en", 2),
    ])).toBeNull();
  });
});
