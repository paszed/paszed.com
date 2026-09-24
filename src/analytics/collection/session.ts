import { track } from "../core/client";
import { getSessionId } from "../session";

const STARTED_KEY = "paszed:analytics:started";

export function startSession(path: string): void {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId();
  const started = window.sessionStorage.getItem(STARTED_KEY);

  if (started) {
    void track({
      type: "session_resume",
      path,
    });
    return;
  }

  window.sessionStorage.setItem(STARTED_KEY, "1");

  void track({
    type: "session_start",
    path,
  });

  void sessionId;
}
