"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type AnalyticsLifecycle = typeof import("@/analytics/collection/lifecycle");

export interface AnalyticsProviderProps {
  loadLifecycle?: () => Promise<AnalyticsLifecycle>;
}

function loadAnalyticsLifecycle(): Promise<AnalyticsLifecycle> {
  return import("@/analytics/collection/lifecycle");
}

export function AnalyticsProvider({
  loadLifecycle = loadAnalyticsLifecycle,
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;

    void loadLifecycle().then(({ startGlobalAnalytics }) => {
      if (!active) return;
      cleanup = startGlobalAnalytics();
    });

    return () => {
      active = false;
      cleanup?.();
    };
  }, [loadLifecycle]);

  useEffect(() => {
    if (!pathname) return;

    let active = true;
    let cleanup: (() => void) | undefined;

    void loadLifecycle().then(
      ({ recordRouteAnalytics, startRouteAnalytics }) => {
        if (!active) return;

        if (previousPathname.current !== pathname) {
          recordRouteAnalytics(pathname, previousPathname.current);
          previousPathname.current = pathname;
        }

        cleanup = startRouteAnalytics(pathname);
      },
    );

    return () => {
      active = false;
      cleanup?.();
    };
  }, [loadLifecycle, pathname]);

  return null;
}

