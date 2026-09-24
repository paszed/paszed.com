import { track } from "../core/client";

const HEARTBEAT_INTERVAL = 30_000;

export function startHeartbeat(path: string): () => void {
  if (typeof window === "undefined") return () => undefined;

  const interval = window.setInterval(() => {
    if (document.visibilityState !== "visible") return;

    void track({
      type: "heartbeat",
      path: window.location.pathname || path,
    });
  }, HEARTBEAT_INTERVAL);

  return () => window.clearInterval(interval);
}
