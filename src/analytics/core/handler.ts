import { NextResponse } from "next/server";

import { readAnalyticsBody } from "@/analytics/core/request";
import { normalizeReferrer } from "@/analytics/core/referrer";
import { isValidAnalyticsContext } from "@/analytics/core/validation";

import type { AnalyticsContext, AnalyticsEventType } from "@/analytics/events/types";
import { supabase } from "@/lib/supabase/server";

const EVENT_TYPES = new Set<AnalyticsEventType>([
  "session_start", "session_resume", "heartbeat", "session_end",
  "page_view", "route_transition", "back_navigation", "forward_navigation",
  "external_navigation", "exit", "visibility_change", "focus", "blur",
  "scroll", "scroll_depth", "dwell", "click", "project_open", "project_expand",
  "github_click", "download", "copy", "form_interaction", "offer_view",
  "service_view", "pricing_view", "specs_view", "capability_discovery",
  "contact_cta", "cta_exposure", "contact_start", "contact_submit", "language_change", "theme_change",
  "experiment_exposure", "variant_exposure", "experiment_conversion",
  "bot_request", "crawl_route", "crawl_error", "crawl_robots", "crawl_sitemap",
]);

interface ValidEvent {
  id: string;
  sessionId: string;
  type: AnalyticsEventType;
  path: string;
  previousPath?: string;
  timestamp: string;
  context?: AnalyticsContext;
}

const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const isPath = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= 2048 && value.startsWith("/");

function isValidEvent(event: unknown): event is ValidEvent {
  if (!event || typeof event !== "object") return false;

  const value = event as Record<string, unknown>;
  const context = value.context;

  if (
    context !== undefined &&
    (typeof context !== "object" || context === null || Array.isArray(context))
  ) {
    return false;
  }

  const typedContext = context as AnalyticsContext | undefined;

  return (
    isUuid(value.id) &&
    isUuid(value.sessionId) &&
    typeof value.type === "string" &&
    EVENT_TYPES.has(value.type as AnalyticsEventType) &&
    isPath(value.path) &&
    (value.previousPath === undefined || isPath(value.previousPath)) &&
    typeof value.timestamp === "string" &&
    !Number.isNaN(Date.parse(value.timestamp)) &&
    isValidAnalyticsContext(typedContext)
  );
}

export async function handleAnalyticsPost(request: Request) {
  let event: unknown;

  try {
    event = await readAnalyticsBody(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return NextResponse.json(
        { ok: false, error: "payload_too_large" },
        { status: 413 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!isValidEvent(event)) {
    return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
  }

  const context = event.context;

  const { data: accepted, error } = await supabase.rpc("ingest_analytics_event", {
    p_event: {
    id: event.id,
    session_id: event.sessionId,
    source: "browser",
    type: event.type,
    path: event.path,
    previous_path: event.previousPath ?? null,
    locale: context?.locale ?? null,
    referrer: normalizeReferrer(context?.referrer),
    viewport_width: context?.viewport?.width ?? null,
    viewport_height: context?.viewport?.height ?? null,
    user_agent: context?.userAgent ?? null,
    traffic_class: context?.trafficClass ?? null,
    metadata: context?.metadata ?? null,
    occurred_at: event.timestamp,
    created_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error("[analytics]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (!accepted) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  return NextResponse.json({ ok: true });
}
