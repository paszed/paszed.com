export type AnalyticsEventType =
  | "page_view"
  | "route_transition"
  | "project_open"
  | "contact_cta"
  | "github_click"
  | "language_change"
  | "theme_change";

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  type: AnalyticsEventType;
  path: string;
  previousPath?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
