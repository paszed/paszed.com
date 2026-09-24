import { track } from "../core/client";

type DiscoveryType =
  | "offer_view"
  | "service_view"
  | "pricing_view"
  | "specs_view"
  | "capability_discovery";

interface DiscoveryOptions {
  type: DiscoveryType;
  target: string;
  metadata?: Record<string, unknown>;
}

export function trackDiscovery({
  type,
  target,
  metadata,
}: DiscoveryOptions): void {
  void track({
    type,
    path: window.location.pathname,
    context: {
      metadata: {
        target,
        ...metadata,
      },
    },
  });
}
