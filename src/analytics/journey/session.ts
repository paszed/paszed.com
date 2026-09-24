import type { AnalyticsEvent } from "../events/types";

export function groupEventsBySession(
  events: AnalyticsEvent[],
): Map<string, AnalyticsEvent[]> {
  const sessions = new Map<string, AnalyticsEvent[]>();

  for (const event of events) {
    const session = sessions.get(event.sessionId);

    if (session) {
      session.push(event);
    } else {
      sessions.set(event.sessionId, [event]);
    }
  }

  for (const session of sessions.values()) {
    session.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }

  return sessions;
}
