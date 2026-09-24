import { trackDiscovery } from "./discovery";

const DISCOVERY_ATTRIBUTE = "data-analytics-discovery";

export function startDiscoveryTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const seen = new Set<string>();

  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const element = entry.target;
      if (!(element instanceof HTMLElement)) continue;

      const target = element.dataset.analyticsDiscovery;
      const type = element.dataset.analyticsDiscoveryType;

      if (!target || seen.has(target)) continue;

      if (
        type !== "offer_view" &&
        type !== "service_view" &&
        type !== "pricing_view" &&
        type !== "specs_view" &&
        type !== "capability_discovery"
      ) {
        continue;
      }

      seen.add(target);

      trackDiscovery({
        type,
        target,
      });
    }
  }, { threshold: 0.5 });

  const observe = (root: ParentNode = document) => {
    if (root instanceof HTMLElement && root.hasAttribute(DISCOVERY_ATTRIBUTE)) {
      intersectionObserver.observe(root);
    }

    root
      .querySelectorAll(`[${DISCOVERY_ATTRIBUTE}]`)
      .forEach((element) => intersectionObserver.observe(element));
  };

  const mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          observe(node);
        });
      }

      if (
        mutation.type === "attributes" &&
        mutation.target instanceof HTMLElement
      ) {
        const element = mutation.target;
        if (element.hasAttribute(DISCOVERY_ATTRIBUTE)) {
          intersectionObserver.observe(element);
        }
      }
    }
  });

  observe();
  mutationObserver.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [
      DISCOVERY_ATTRIBUTE,
      "data-analytics-discovery-type",
    ],
  });

  return () => {
    mutationObserver.disconnect();
    intersectionObserver.disconnect();
  };
}
