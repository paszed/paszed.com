import type { AnalyticsEvent } from "../events/types";

export interface CrawlerMetrics {
  botRequestCount: number;
  crawlRouteCount: number;
  crawlErrorCount: number;
  crawlRobotsCount: number;
  crawlSitemapCount: number;
  observedSessionCount: number;
}

export function buildCrawlerMetrics(events: AnalyticsEvent[]): CrawlerMetrics {
  const sessions = new Set<string>();
  const metrics: CrawlerMetrics = {
    botRequestCount: 0,
    crawlRouteCount: 0,
    crawlErrorCount: 0,
    crawlRobotsCount: 0,
    crawlSitemapCount: 0,
    observedSessionCount: 0,
  };

  for (const event of events) {
    switch (event.type) {
      case "bot_request":
        metrics.botRequestCount += 1;
        break;
      case "crawl_route":
        metrics.crawlRouteCount += 1;
        break;
      case "crawl_error":
        metrics.crawlErrorCount += 1;
        break;
      case "crawl_robots":
        metrics.crawlRobotsCount += 1;
        break;
      case "crawl_sitemap":
        metrics.crawlSitemapCount += 1;
        break;
      default:
        continue;
    }

    sessions.add(event.sessionId);
  }

  metrics.observedSessionCount = sessions.size;
  return metrics;
}
