import type { AnalyticsEvent } from "../events/types";

export interface ConversionMetrics {
  contactCtaCount: number;
  contactStartCount: number;
  contactSubmitCount: number;
  contactCtaSessionCount: number;
  contactStartSessionCount: number;
  contactSubmitSessionCount: number;
}

export function buildConversionMetrics(events: AnalyticsEvent[]): ConversionMetrics {
  const ctaSessions = new Set<string>();
  const startSessions = new Set<string>();
  const submitSessions = new Set<string>();
  let contactCtaCount = 0;
  let contactStartCount = 0;
  let contactSubmitCount = 0;

  for (const event of events) {
    switch (event.type) {
      case "contact_cta":
        contactCtaCount += 1;
        ctaSessions.add(event.sessionId);
        break;
      case "contact_start":
        contactStartCount += 1;
        startSessions.add(event.sessionId);
        break;
      case "contact_submit":
        contactSubmitCount += 1;
        submitSessions.add(event.sessionId);
        break;
    }
  }

  return {
    contactCtaCount,
    contactStartCount,
    contactSubmitCount,
    contactCtaSessionCount: ctaSessions.size,
    contactStartSessionCount: startSessions.size,
    contactSubmitSessionCount: submitSessions.size,
  };
}
