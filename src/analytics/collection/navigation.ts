import { track } from "../core/client";

const HISTORY_INDEX_KEY = "paszed:analytics:history-index";

function getHistoryIndex(): number {
  const value = window.sessionStorage.getItem(HISTORY_INDEX_KEY);
  const index = value ? Number(value) : 0;
  return Number.isFinite(index) ? index : 0;
}

function setHistoryIndex(index: number): void {
  window.sessionStorage.setItem(HISTORY_INDEX_KEY, String(index));
}

export function startNavigationTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  let currentIndex = getHistoryIndex();

  const stampState = (state: unknown, index: number) => (
    state && typeof state === "object"
      ? { ...state, analyticsIndex: index }
      : { analyticsIndex: index }
  );

  if (typeof window.history.state?.analyticsIndex !== "number") {
    originalReplaceState(
      stampState(window.history.state, currentIndex),
      "",
    );
  } else {
    currentIndex = window.history.state.analyticsIndex;
    setHistoryIndex(currentIndex);
  }

  window.history.pushState = function pushState(state, unused, url) {
    currentIndex += 1;
    setHistoryIndex(currentIndex);
    return originalPushState(stampState(state, currentIndex), unused, url);
  };

  window.history.replaceState = function replaceState(state, unused, url) {
    return originalReplaceState(stampState(state, currentIndex), unused, url);
  };

  const handlePopState = (event: PopStateEvent) => {
    const nextIndex = event.state?.analyticsIndex;

    if (typeof nextIndex !== "number") return;

    const type = nextIndex < currentIndex
      ? "back_navigation"
      : "forward_navigation";

    void track({
      type,
      path: window.location.pathname,
      context: {
        metadata: {
          fromIndex: currentIndex,
          toIndex: nextIndex,
        },
      },
    });

    currentIndex = nextIndex;
    setHistoryIndex(currentIndex);
  };

  const handleExternalNavigation = (event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const link = target.closest("a");

    if (!(link instanceof HTMLAnchorElement) || !link.href) return;

    const destination = new URL(link.href, window.location.href);

    if (destination.origin === window.location.origin) return;

    void track({
      type: "external_navigation",
      path: window.location.pathname,
      context: {
        metadata: {
          hostname: destination.hostname,
          protocol: destination.protocol,
        },
      },
    });
  };

  window.addEventListener("popstate", handlePopState);
  document.addEventListener("click", handleExternalNavigation, { passive: true });

  return () => {
    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
    window.removeEventListener("popstate", handlePopState);
    document.removeEventListener("click", handleExternalNavigation);
  };
}
