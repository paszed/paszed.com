import type { AnalyticsEvent } from "../events/types";

export interface ExperimentMetrics {
  experimentExposureCount: number;
  variantExposureCount: number;
  experimentConversionCount: number;
  exposedSessionCount: number;
  convertedSessionCount: number;
}

export function buildExperimentMetrics(events: AnalyticsEvent[]): ExperimentMetrics {
  const exposedSessions = new Set<string>();
  const convertedSessions = new Set<string>();
  const metrics: ExperimentMetrics = {
    experimentExposureCount: 0,
    variantExposureCount: 0,
    experimentConversionCount: 0,
    exposedSessionCount: 0,
    convertedSessionCount: 0,
  };

  for (const event of events) {
    switch (event.type) {
      case "experiment_exposure":
        metrics.experimentExposureCount += 1;
        exposedSessions.add(event.sessionId);
        break;
      case "variant_exposure":
        metrics.variantExposureCount += 1;
        exposedSessions.add(event.sessionId);
        break;
      case "experiment_conversion":
        metrics.experimentConversionCount += 1;
        convertedSessions.add(event.sessionId);
        break;
    }
  }

  metrics.exposedSessionCount = exposedSessions.size;
  metrics.convertedSessionCount = convertedSessions.size;
  return metrics;
}
