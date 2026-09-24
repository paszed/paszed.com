import { trackInteraction } from "./interactions";

export function startClickTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleClick = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const interactive = target.closest("a, button");

    if (!(interactive instanceof HTMLElement)) return;

    const element = interactive as HTMLAnchorElement | HTMLButtonElement;
    const analyticsId = element.dataset.analyticsId;
    const destination = element instanceof HTMLAnchorElement
      ? new URL(element.href, window.location.href)
      : null;
    const isInternal = destination?.origin === window.location.origin;

    trackInteraction({
      type: "click",
      target: element.tagName.toLowerCase(),
      metadata: {
        ...(analyticsId ? { analyticsId } : {}),
        ...(destination && isInternal ? { destinationPath: destination.pathname } : {}),
        ...(destination && !isInternal && destination.protocol.startsWith("http")
          ? { destinationHost: destination.hostname }
          : {}),
      },
    });
  };

  document.addEventListener("click", handleClick, { passive: true });

  return () => {
    document.removeEventListener("click", handleClick);
  };
}
