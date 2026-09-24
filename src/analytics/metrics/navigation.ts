import type { AnalyticsEvent } from "../events/types";
import type { JourneyReport } from "../journey/report";

export interface NavigationMetrics {
  routeTransitionEventCount: number;
  backNavigationCount: number;
  forwardNavigationCount: number;
  externalNavigationCount: number;
  observedRouteCount: number;
  reconstructedTransitionCount: number;
}

export function buildNavigationMetrics(
  events: AnalyticsEvent[],
  journeys: JourneyReport,
): NavigationMetrics {
  const metrics: NavigationMetrics = {
    routeTransitionEventCount: 0,
    backNavigationCount: 0,
    forwardNavigationCount: 0,
    externalNavigationCount: 0,
    observedRouteCount: journeys.graph.nodes.length,
    reconstructedTransitionCount: journeys.graph.transitions.reduce(
      (total, transition) => total + transition.count,
      0,
    ),
  };

  for (const event of events) {
    switch (event.type) {
      case "route_transition":
        metrics.routeTransitionEventCount += 1;
        break;
      case "back_navigation":
        metrics.backNavigationCount += 1;
        break;
      case "forward_navigation":
        metrics.forwardNavigationCount += 1;
        break;
      case "external_navigation":
        metrics.externalNavigationCount += 1;
        break;
    }
  }

  return metrics;
}
