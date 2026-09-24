"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  recordRouteAnalytics,
  startGlobalAnalytics,
  startRouteAnalytics,
} from "@/analytics/collection/lifecycle";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => startGlobalAnalytics(), []);

  useEffect(() => {
    if (!pathname) return;

    if (previousPathname.current !== pathname) {
      recordRouteAnalytics(pathname, previousPathname.current);
      previousPathname.current = pathname;
    }

    return startRouteAnalytics(pathname);
  }, [pathname]);

  return null;
}
