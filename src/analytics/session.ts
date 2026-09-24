const SESSION_KEY = "paszed:analytics:session";

export function getSessionId(): string {
  if (typeof window === "undefined") {
    throw new Error("getSessionId() must be called in the browser");
  }

  const existing = window.sessionStorage.getItem(SESSION_KEY);

  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();

  window.sessionStorage.setItem(SESSION_KEY, sessionId);

  return sessionId;
}
