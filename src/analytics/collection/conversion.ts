import { track } from "../core/client";

type ConversionType =
  | "contact_cta"
  | "contact_start"
  | "contact_submit";

export function trackConversion(
  type: ConversionType,
  target?: string,
  metadata?: Record<string, unknown>,
): void {
  void track({
    type,
    path: window.location.pathname,
    context: {
      metadata: {
        ...(target ? { target } : {}),
        ...metadata,
      },
    },
  });
}

export function trackContactCta(target = "contact"): void {
  trackConversion("contact_cta", target);
}

export function trackContactStart(target = "contact-form"): void {
  trackConversion("contact_start", target);
}

export function trackContactSubmit(target = "contact-form"): void {
  trackConversion("contact_submit", target);
}
