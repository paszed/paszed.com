import { track } from "../core/client";

const DEPTHS = [25, 50, 75, 90, 100];
const SCROLL_INTERVAL = 5_000;

export function startScrollTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const reached = new Set<number>();
  let ticking = false;
  let lastTrackedAt = 0;

  const measureDepth = () => {
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollableHeight = documentHeight - viewportHeight;

    if (scrollableHeight <= 0) return 100;

    return Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100));
  };

  const handleScroll = () => {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      ticking = false;

      const depth = measureDepth();
      const now = Date.now();

      for (const milestone of DEPTHS) {
        if (depth < milestone || reached.has(milestone)) continue;

        reached.add(milestone);

        void track({
          type: "scroll_depth",
          path: window.location.pathname,
          context: {
            metadata: { depth: milestone },
          },
        });
      }

      if (now - lastTrackedAt < SCROLL_INTERVAL) return;
      lastTrackedAt = now;

      void track({
        type: "scroll",
        path: window.location.pathname,
        context: {
          metadata: { depth },
        },
      });
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}
