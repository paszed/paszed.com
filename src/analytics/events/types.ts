export type AnalyticsSource = "browser" | "server";

export type AnalyticsTrafficClass = "human" | "crawler" | "bot" | "preview" | "unknown";

export type AnalyticsEventType =
  | "session_start"
  | "session_resume"
  | "heartbeat"
  | "session_end"
  | "page_view"
  | "route_transition"
  | "back_navigation"
  | "forward_navigation"
  | "external_navigation"
  | "exit"
  | "visibility_change"
  | "focus"
  | "blur"
  | "scroll"
  | "scroll_depth"
  | "dwell"
  | "click"
  | "project_open"
  | "project_expand"
  | "github_click"
  | "download"
  | "copy"
  | "form_interaction"
  | "offer_view"
  | "service_view"
  | "pricing_view"
  | "specs_view"
  | "capability_discovery"
  | "contact_cta"
  | "cta_exposure"
  | "contact_start"
  | "contact_submit"
  | "language_change"
  | "theme_change"
  | "experiment_exposure"
  | "variant_exposure"
  | "experiment_conversion"
  | "bot_request"
  | "crawl_route"
  | "crawl_error"
  | "crawl_robots"
  | "crawl_sitemap";

export interface AnalyticsContext {
  locale?: string;
  referrer?: string;
  viewport?: { width: number; height: number };
  userAgent?: string;
  trafficClass?: AnalyticsTrafficClass;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  type: AnalyticsEventType;
  source: AnalyticsSource;
  path: string;
  previousPath?: string;
  timestamp: string;
  context?: AnalyticsContext;
}
