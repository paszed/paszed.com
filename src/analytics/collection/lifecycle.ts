import { track } from "../core/client";
import { startClickTracking } from "./clicks";
import { startCtaExposureTracking } from "./cta-exposure";
import { startDwellTracking } from "./dwell";
import { startDiscoveryTracking } from "./discovery-observer";
import { startExitTracking } from "./exit";
import { startHeartbeat } from "./heartbeat";
import { startNavigationTracking } from "./navigation";
import { startScrollTracking } from "./scrolling";
import { startSession } from "./session";
import { startVisibilityTracking } from "./visibility";

type Cleanup = () => void;

export function startGlobalAnalytics(): Cleanup {
  const stop = [
    startClickTracking(),
    startExitTracking(),
    startNavigationTracking(),
    startVisibilityTracking(),
  ];

  return () => {
    for (const cleanup of stop) cleanup();
  };
}

export function recordRouteAnalytics(
  pathname: string,
  previousPath: string | null,
): void {
  if (!previousPath) {
    startSession(pathname);
  } else if (previousPath !== pathname) {
    void track({
      type: "route_transition",
      path: pathname,
      previousPath,
    });
  }

  void track({
    type: "page_view",
    path: pathname,
    ...(previousPath ? { previousPath } : {}),
  });
}

export function startRouteAnalytics(pathname: string): Cleanup {
  const stop = [
    startHeartbeat(pathname),
    startCtaExposureTracking(pathname),
    startDwellTracking(),
    startDiscoveryTracking(),
    startScrollTracking(),
  ];

  return () => {
    for (const cleanup of stop) cleanup();
  };
}
