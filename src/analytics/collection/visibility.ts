import { track } from "../core/client";

export function startVisibilityTracking(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleVisibilityChange = () => {
    void track({
      type: "visibility_change",
      path: window.location.pathname,
      context: {
        metadata: {
          state: document.visibilityState,
        },
      },
    });
  };

  const handleFocus = () => {
    void track({
      type: "focus",
      path: window.location.pathname,
    });
  };

  const handleBlur = () => {
    void track({
      type: "blur",
      path: window.location.pathname,
    });
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("blur", handleBlur);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("blur", handleBlur);
  };
}
