import type { AnalyticsContext } from "../events/types";

const TRAFFIC_CLASSES = new Set([
  "human", "crawler", "bot", "preview", "unknown",
]);

const isOptionalString = (value: unknown, maxLength: number): boolean =>
  value === undefined ||
  (typeof value === "string" && value.length <= maxLength);

export function isValidAnalyticsContext(value: unknown): value is AnalyticsContext {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const context = value as Record<string, unknown>;
  const viewport = context.viewport;

  const validViewport = viewport === undefined || (
    typeof viewport === "object" &&
    viewport !== null &&
    !Array.isArray(viewport) &&
    Number.isInteger((viewport as Record<string, unknown>).width) &&
    Number.isInteger((viewport as Record<string, unknown>).height) &&
    Number((viewport as Record<string, unknown>).width) >= 0 &&
    Number((viewport as Record<string, unknown>).height) >= 0 &&
    Number((viewport as Record<string, unknown>).width) <= 100_000 &&
    Number((viewport as Record<string, unknown>).height) <= 100_000
  );

  return (
    isOptionalString(context.locale, 16) &&
    isOptionalString(context.referrer, 2_048) &&
    isOptionalString(context.userAgent, 1_024) &&
    (context.trafficClass === undefined ||
      (typeof context.trafficClass === "string" &&
        TRAFFIC_CLASSES.has(context.trafficClass))) &&
    validViewport &&
    (context.metadata === undefined || (
      typeof context.metadata === "object" &&
      context.metadata !== null &&
      !Array.isArray(context.metadata) &&
      JSON.stringify(context.metadata).length <= 8_192
    ))
  );
}
