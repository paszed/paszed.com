import type { AnalyticsEvent } from "../events/types";

export interface PerformanceMetrics {
  dwellSampleCount: number;
  observedActiveMs: number;
  scrollDepthSampleCount: number;
  maxObservedScrollDepth: number | null;
}

export function buildPerformanceMetrics(events: AnalyticsEvent[]): PerformanceMetrics {
  const activeBySessionPath = new Map<string, number>();
  let dwellSampleCount = 0;
  let scrollDepthSampleCount = 0;
  let maxObservedScrollDepth: number | null = null;

  for (const event of events) {
    const metadata = event.context?.metadata;

    if (event.type === "dwell") {
      const activeMs = metadata?.activeMs;
      if (typeof activeMs !== "number" || !Number.isFinite(activeMs) || activeMs < 0) continue;

      dwellSampleCount += 1;
      const key = JSON.stringify([event.sessionId, event.path]);
      activeBySessionPath.set(key, Math.max(activeBySessionPath.get(key) ?? 0, activeMs));
    }

    if (event.type === "scroll_depth") {
      const depth = metadata?.depth;
      if (typeof depth !== "number" || !Number.isFinite(depth) || depth < 0 || depth > 100) continue;

      scrollDepthSampleCount += 1;
      maxObservedScrollDepth = Math.max(maxObservedScrollDepth ?? 0, depth);
    }
  }

  return {
    dwellSampleCount,
    observedActiveMs: [...activeBySessionPath.values()].reduce((sum, ms) => sum + ms, 0),
    scrollDepthSampleCount,
    maxObservedScrollDepth,
  };
}
