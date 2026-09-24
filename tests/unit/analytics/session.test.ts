import { afterEach, describe, expect, it, vi } from "vitest";
import { getSessionId } from "../../../src/analytics/session";

const SESSION_KEY = "paszed:analytics:session";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

describe("getSessionId", () => {
  it("rejects calls outside the browser", () => {
    vi.stubGlobal("window", undefined);

    expect(() => getSessionId()).toThrow(
      "getSessionId() must be called in the browser",
    );
  });

  it("returns an existing session ID without replacing it", () => {
    window.sessionStorage.setItem(SESSION_KEY, "existing-session");
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    expect(getSessionId()).toBe("existing-session");
    expect(setItem).not.toHaveBeenCalled();
  });

  it("creates and stores a session ID when none exists", () => {
    const sessionId = getSessionId();

    expect(sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBe(sessionId);
    expect(getSessionId()).toBe(sessionId);
  });
});
