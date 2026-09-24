"use client";

import { useEffect, useRef } from "react";

type DiscoveryType =
  | "offer_view"
  | "service_view"
  | "pricing_view"
  | "specs_view"
  | "capability_discovery";

interface DiscoveryOptions {
  type: DiscoveryType;
  target: string;
}

export function useDiscovery({
  type,
  target,
}: DiscoveryOptions) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.dataset.analyticsDiscovery = target;
    element.dataset.analyticsDiscoveryType = type;
  }, [target, type]);

  return ref;
}
