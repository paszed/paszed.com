import type { AnalyticsEvent, AnalyticsEventType } from "../events/types";

const interactionTypes = new Set<AnalyticsEventType>([
  "click",
  "project_open",
  "project_expand",
  "github_click",
  "download",
  "copy",
  "form_interaction",
]);

export interface EngagementMetrics {
  interactionCount: number;
  interactionSessionCount: number;
  scrollEventCount: number;
  scrollDepthEventCount: number;
  dwellEventCount: number;
  focusEventCount: number;
  blurEventCount: number;
  visibilityChangeCount: number;
}

export function buildEngagementMetrics(events: AnalyticsEvent[]): EngagementMetrics {
  const interactionSessions = new Set<string>();
  const metrics: EngagementMetrics = {
    interactionCount: 0,
    interactionSessionCount: 0,
    scrollEventCount: 0,
    scrollDepthEventCount: 0,
    dwellEventCount: 0,
    focusEventCount: 0,
    blurEventCount: 0,
    visibilityChangeCount: 0,
  };

  for (const event of events) {
    if (interactionTypes.has(event.type)) {
      metrics.interactionCount += 1;
      interactionSessions.add(event.sessionId);
    }

    switch (event.type) {
      case "scroll":
        metrics.scrollEventCount += 1;
        break;
      case "scroll_depth":
        metrics.scrollDepthEventCount += 1;
        break;
      case "dwell":
        metrics.dwellEventCount += 1;
        break;
      case "focus":
        metrics.focusEventCount += 1;
        break;
      case "blur":
        metrics.blurEventCount += 1;
        break;
      case "visibility_change":
        metrics.visibilityChangeCount += 1;
        break;
    }
  }

  metrics.interactionSessionCount = interactionSessions.size;
  return metrics;
}
