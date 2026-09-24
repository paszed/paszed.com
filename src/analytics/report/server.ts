import "server-only";

import { buildJourneyReport } from "../journey/report";
import { readJourneyEvents } from "../journey/repository";
import { buildNavigationMetrics } from "../metrics/navigation";
import { buildConversionMetrics } from "../metrics/conversion";
import { buildCrawlerMetrics } from "../metrics/crawlers";
import { buildDiscoveryMetrics } from "../metrics/discovery";
import { buildEngagementMetrics } from "../metrics/engagement";
import { buildExperimentMetrics } from "../metrics/experiments";
import { buildPerformanceMetrics } from "../metrics/performance";
import { buildTrafficMetrics } from "../metrics/traffic";

export async function readAnalyticsReport(from: Date, to: Date) {
  const { events, truncated } = await readJourneyEvents(from, to);
  const journeys = buildJourneyReport(events);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    truncated,
    traffic: buildTrafficMetrics(events),
    navigation: buildNavigationMetrics(events, journeys),
    conversion: buildConversionMetrics(events),
    crawlers: buildCrawlerMetrics(events),
    discovery: buildDiscoveryMetrics(events),
    engagement: buildEngagementMetrics(events),
    experiments: buildExperimentMetrics(events),
    performance: buildPerformanceMetrics(events),
    journeys,
  };
}

