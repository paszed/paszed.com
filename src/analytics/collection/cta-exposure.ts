import { track } from "../core/client";

const CTA_IDS = [
  "home.hero.primary-cta",
  "home.contact.cta",
  "about.contact.cta",
  "specs.contact.cta",
] as const;

const EXPOSURE_DELAY_MS = 1000;
const EXPOSURE_THRESHOLD = 0.5;

function isVisibleEnough(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  const visibleWidth = Math.max(
    0,
    Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
  );
  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
  );

  return (visibleWidth * visibleHeight) / (rect.width * rect.height)
    >= EXPOSURE_THRESHOLD;
}

export function startCtaExposureTracking(path: string): () => void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return () => undefined;
  }

  const seen = new Set<string>();
  const pending = new Map<Element, ReturnType<typeof setTimeout>>();
  const selector = CTA_IDS.map((id) => `[data-analytics-id="${id}"]`).join(",");

  function cancel(element: Element): void {
    const timer = pending.get(element);
    if (timer !== undefined) clearTimeout(timer);
    pending.delete(element);
  }

  function schedule(element: Element): void {
    const id = element instanceof HTMLElement
      ? element.dataset.analyticsId
      : undefined;

    if (
      !id ||
      seen.has(id) ||
      pending.has(element) ||
      document.visibilityState !== "visible" ||
      !isVisibleEnough(element)
    ) return;

    const timer = setTimeout(() => {
      pending.delete(element);

      if (
        seen.has(id) ||
        !element.isConnected ||
        document.visibilityState !== "visible" ||
        !isVisibleEnough(element)
      ) return;

      seen.add(id);
      observer.unobserve(element);

      void track({
        type: "cta_exposure",
        path,
        context: {
          metadata: {
            analyticsId: id,
            threshold: EXPOSURE_THRESHOLD,
            durationMs: EXPOSURE_DELAY_MS,
          },
        },
      });
    }, EXPOSURE_DELAY_MS);

    pending.set(element, timer);
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.intersectionRatio < EXPOSURE_THRESHOLD) {
        cancel(entry.target);
      } else {
        schedule(entry.target);
      }
    }
  }, { threshold: [0, EXPOSURE_THRESHOLD, 1] });

  function observe(): void {
    document.querySelectorAll(selector).forEach((element) => {
      const id = element instanceof HTMLElement
        ? element.dataset.analyticsId
        : undefined;
      if (id && !seen.has(id)) observer.observe(element);
    });
  }

  const mutationObserver = new MutationObserver(observe);
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  function handleVisibilityChange(): void {
    if (document.visibilityState !== "visible") {
      for (const element of pending.keys()) cancel(element);
      return;
    }

    document.querySelectorAll(selector).forEach(schedule);
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  observe();

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    mutationObserver.disconnect();
    observer.disconnect();
    for (const element of pending.keys()) cancel(element);
  };
}
