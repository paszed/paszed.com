import { track } from "../core/client";

const DWELL_INTERVAL = 15_000;

export function startDwellTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  let activeMs = 0;
  let activeSince: number | null = null;

  const isActive = () =>
    document.visibilityState === "visible" && document.hasFocus();

  const update = () => {
    const now = performance.now();

    if (activeSince !== null) {
      activeMs += now - activeSince;
    }

    activeSince = isActive() ? now : null;
  };

  const interval = window.setInterval(() => {
    update();
    if (activeSince === null) return;

    void track({
      type: "dwell",
      path: window.location.pathname,
      context: { metadata: { activeMs: Math.round(activeMs) } },
    });
  }, DWELL_INTERVAL);

  document.addEventListener("visibilitychange", update);
  window.addEventListener("focus", update);
  window.addEventListener("blur", update);
  update();

  return () => {
    update();
    window.clearInterval(interval);
    document.removeEventListener("visibilitychange", update);
    window.removeEventListener("focus", update);
    window.removeEventListener("blur", update);
  };
}
