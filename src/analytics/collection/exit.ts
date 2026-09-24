import { sendEventBeacon } from "../core/transport";
import { track } from "../core/client";

export function startExitTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  let exited = false;

  const handlePageHide = (pageEvent: PageTransitionEvent) => {
    if (pageEvent.persisted) return;
    if (exited) return;
    exited = true;

    const event = {
      type: "exit" as const,
      path: window.location.pathname,
    };

    if (!sendEventBeacon(event)) {
      void track(event);
    }
  };

  window.addEventListener("pagehide", handlePageHide);

  return () => {
    window.removeEventListener("pagehide", handlePageHide);
  };
}
