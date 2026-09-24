import type { AnalyticsEvent } from "../events/types";

const discoveryTypes = [
  "offer_view",
  "service_view",
  "pricing_view",
  "specs_view",
  "capability_discovery",
] as const;

type DiscoveryType = (typeof discoveryTypes)[number];

export interface DiscoveryMetrics {
  eventCounts: Record<DiscoveryType, number>;
  sessionCounts: Record<DiscoveryType, number>;
}

export function buildDiscoveryMetrics(events: AnalyticsEvent[]): DiscoveryMetrics {
  const eventCounts = Object.fromEntries(
    discoveryTypes.map((type) => [type, 0]),
  ) as Record<DiscoveryType, number>;
  const sessions = Object.fromEntries(
    discoveryTypes.map((type) => [type, new Set<string>()]),
  ) as Record<DiscoveryType, Set<string>>;

  for (const event of events) {
    if (!discoveryTypes.some((type) => type === event.type)) continue;

    const type = event.type as DiscoveryType;
    eventCounts[type] += 1;
    sessions[type].add(event.sessionId);
  }

  return {
    eventCounts,
    sessionCounts: Object.fromEntries(
      discoveryTypes.map((type) => [type, sessions[type].size]),
    ) as Record<DiscoveryType, number>,
  };
}
