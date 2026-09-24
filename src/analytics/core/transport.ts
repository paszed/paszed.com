import type { TrackEventInput } from "../events";
import { getBrowserContext } from "../context/browser";
import { getSessionId } from "../session";

export function createEventPayload(event: TrackEventInput) {
  return {
    id: crypto.randomUUID(),
    sessionId: getSessionId(),
    source: "browser" as const,
    timestamp: new Date().toISOString(),
    ...event,
    context: {
      ...getBrowserContext(),
      ...event.context,
    },
  };
}

export function sendEventBeacon(event: TrackEventInput): boolean {
  if (typeof window === "undefined" || !navigator.sendBeacon) {
    return false;
  }

  const payload = JSON.stringify(createEventPayload(event));
  return navigator.sendBeacon(
    "/api/analytics",
    new Blob([payload], { type: "application/json" }),
  );
}
