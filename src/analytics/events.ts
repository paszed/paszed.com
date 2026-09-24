import type { AnalyticsContext, AnalyticsEventType } from "./events/types";

export interface TrackEventInput {
  type: AnalyticsEventType;
  path: string;
  previousPath?: string;
  context?: AnalyticsContext;
}
