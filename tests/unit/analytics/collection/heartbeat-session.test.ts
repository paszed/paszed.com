import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startHeartbeat } from "../../../../src/analytics/collection/heartbeat";
import { startSession } from "../../../../src/analytics/collection/session";
import { track } from "../../../../src/analytics/core/client";
import { getSessionId } from "../../../../src/analytics/session";

vi.mock("../../../../src/analytics/core/client", () => ({ track: vi.fn() }));
vi.mock("../../../../src/analytics/session", () => ({
  getSessionId: vi.fn(() => "session-1"),
}));

const STARTED_KEY = "paszed:analytics:started";

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/current");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("startHeartbeat", () => {
  it("does nothing outside the browser", () => {
    vi.stubGlobal("window", undefined);
    expect(startHeartbeat("/fallback")).toBeTypeOf("function");
    expect(track).not.toHaveBeenCalled();
  });

  it("tracks the current pathname every 30 seconds while visible", () => {
    vi.useFakeTimers();
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    const stop = startHeartbeat("/fallback");

    vi.advanceTimersByTime(30_000);
    expect(track).toHaveBeenCalledWith({
      type: "heartbeat",
      path: "/current",
    });

    stop();
    vi.advanceTimersByTime(30_000);
    expect(track).toHaveBeenCalledOnce();
  });

  it("skips heartbeats while the document is hidden", () => {
    vi.useFakeTimers();
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    const stop = startHeartbeat("/fallback");

    vi.advanceTimersByTime(30_000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });
});

describe("startSession", () => {
  it("does nothing outside the browser", () => {
    vi.stubGlobal("window", undefined);
    startSession("/about");
    expect(getSessionId).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
  });

  it("starts and records a new session", () => {
    startSession("/about");

    expect(getSessionId).toHaveBeenCalledOnce();
    expect(window.sessionStorage.getItem(STARTED_KEY)).toBe("1");
    expect(track).toHaveBeenCalledWith({
      type: "session_start",
      path: "/about",
    });
  });

  it("resumes a previously started session", () => {
    window.sessionStorage.setItem(STARTED_KEY, "1");
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    startSession("/about");

    expect(getSessionId).toHaveBeenCalledOnce();
    expect(setItem).not.toHaveBeenCalled();
    expect(track).toHaveBeenCalledWith({
      type: "session_resume",
      path: "/about",
    });
  });
});

describe("startHeartbeat: remaining coverage", () => {
  it("allows calling the server-side no-op cleanup", () => {
    vi.stubGlobal("window", undefined);
    expect(startHeartbeat("/fallback")()).toBeUndefined();
  });

  it("uses the supplied path when the current pathname is empty", () => {
    vi.useFakeTimers();
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    const originalLocation = window.location;
    vi.stubGlobal("window", {
      location: { pathname: "" },
      setInterval: window.setInterval.bind(window),
      clearInterval: window.clearInterval.bind(window),
    });

    const stop = startHeartbeat("/fallback");
    vi.advanceTimersByTime(30_000);
    expect(track).toHaveBeenCalledWith({
      type: "heartbeat",
      path: "/fallback",
    });
    stop();
    expect(originalLocation.pathname).toBeTruthy();
  });
});
