import type { AnalyticsEvent } from "../events/types";

export interface JourneyPath {
  sessionId: string;
  entry: string;
  routes: string[];
  exit?: string;
  observedStart: boolean;
  observedExit: boolean;
}

export function buildJourneyPath(events: AnalyticsEvent[]): JourneyPath | null {
  if (events.length === 0) return null;

  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const sessionId = sorted[0].sessionId;
  const routes: string[] = [];

  for (const event of sorted) {
    if (event.type !== "page_view" && event.type !== "route_transition") continue;

    if (routes.at(-1) === event.path) continue;

    routes.push(event.path);
  }

  if (routes.length === 0) return null;

  const exitEvent = sorted.findLast((event) => event.type === "exit");

  return {
    sessionId,
    entry: routes[0],
    routes,
    exit: exitEvent?.path,
    observedStart: sorted.some((event) => event.type === "session_start"),
    observedExit: exitEvent !== undefined,
  };
}
