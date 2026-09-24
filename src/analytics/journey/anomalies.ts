import type { JourneyPath } from "./path";

export type JourneyAnomalyType =
  | "backtrack"
  | "loop"
  | "repeated_route"
  | "deep_journey";

export interface JourneyAnomaly {
  type: JourneyAnomalyType;
  path: string;
  routes: string[];
  detail?: string;
}

const MAX_NORMAL_DEPTH = 8;

export function detectJourneyAnomalies(path: JourneyPath): JourneyAnomaly[] {
  const anomalies: JourneyAnomaly[] = [];
  const { routes } = path;

  if (routes.length > MAX_NORMAL_DEPTH) {
    anomalies.push({
      type: "deep_journey",
      path: path.entry,
      routes,
      detail: `${routes.length} routes visited`,
    });
  }

  const seen = new Map<string, number>();

  routes.forEach((route, index) => {
    const previousIndex = seen.get(route);

    if (previousIndex !== undefined) {
      const segment = routes.slice(previousIndex, index + 1);

      if (segment.length === 2) {
        anomalies.push({
          type: "backtrack",
          path: route,
          routes: segment,
        });
      } else {
        anomalies.push({
          type: "loop",
          path: route,
          routes: segment,
        });
      }
    }

    seen.set(route, index);
  });

  const counts = new Map<string, number>();

  for (const route of routes) {
    counts.set(route, (counts.get(route) ?? 0) + 1);
  }

  for (const [route, count] of counts) {
    if (count < 3) continue;

    anomalies.push({
      type: "repeated_route",
      path: route,
      routes,
      detail: `Visited ${count} times`,
    });
  }

  return anomalies;
}
