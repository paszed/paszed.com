import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startExitTracking } from "../../../../src/analytics/collection/exit";
import { startVisibilityTracking } from "../../../../src/analytics/collection/visibility";
import { track } from "../../../../src/analytics/core/client";
import { sendEventBeacon } from "../../../../src/analytics/core/transport";

vi.mock("../../../../src/analytics/core/client", () => ({ track: vi.fn() }));
vi.mock("../../../../src/analytics/core/transport", () => ({
  sendEventBeacon: vi.fn(),
}));

function pageHide(persisted: boolean): Event {
  const event = new Event("pagehide");
  Object.defineProperty(event, "persisted", { value: persisted });
  return event;
}

beforeEach(() => {
  window.history.replaceState({}, "", "/current");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("startExitTracking", () => {
  it("does nothing outside the browser", () => {
    vi.stubGlobal("window", undefined);
    expect(startExitTracking()).toBeTypeOf("function");
    expect(sendEventBeacon).not.toHaveBeenCalled();
  });

  it("ignores pagehide events persisted in the back-forward cache", () => {
    const stop = startExitTracking();
    window.dispatchEvent(pageHide(true));
    expect(sendEventBeacon).not.toHaveBeenCalled();
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("sends one exit beacon even if pagehide fires repeatedly", () => {
    vi.mocked(sendEventBeacon).mockReturnValue(true);
    const stop = startExitTracking();

    window.dispatchEvent(pageHide(false));
    window.dispatchEvent(pageHide(false));

    expect(sendEventBeacon).toHaveBeenCalledOnce();
    expect(sendEventBeacon).toHaveBeenCalledWith({
      type: "exit",
      path: "/current",
    });
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("falls back to track when the beacon is rejected", () => {
    vi.mocked(sendEventBeacon).mockReturnValue(false);
    const stop = startExitTracking();

    window.dispatchEvent(pageHide(false));

    expect(track).toHaveBeenCalledWith({
      type: "exit",
      path: "/current",
    });
    stop();
  });

  it("removes the pagehide listener on cleanup", () => {
    const stop = startExitTracking();
    stop();
    window.dispatchEvent(pageHide(false));
    expect(sendEventBeacon).not.toHaveBeenCalled();
  });
});

describe("startVisibilityTracking", () => {
  it("does nothing outside the browser", () => {
    vi.stubGlobal("window", undefined);
    expect(startVisibilityTracking()).toBeTypeOf("function");
    expect(track).not.toHaveBeenCalled();
  });

  it("tracks visibility changes with the current document state", () => {
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    const stop = startVisibilityTracking();

    document.dispatchEvent(new Event("visibilitychange"));

    expect(track).toHaveBeenCalledWith({
      type: "visibility_change",
      path: "/current",
      context: { metadata: { state: "hidden" } },
    });
    stop();
  });

  it("tracks focus and blur", () => {
    const stop = startVisibilityTracking();

    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("blur"));

    expect(track).toHaveBeenNthCalledWith(1, {
      type: "focus",
      path: "/current",
    });
    expect(track).toHaveBeenNthCalledWith(2, {
      type: "blur",
      path: "/current",
    });
    stop();
  });

  it("removes all listeners on cleanup", () => {
    const stop = startVisibilityTracking();
    stop();

    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new Event("blur"));

    expect(track).not.toHaveBeenCalled();
  });
});

describe("server-side cleanup functions", () => {
  it("allows calling the exit-tracking no-op cleanup", () => {
    vi.stubGlobal("window", undefined);
    expect(startExitTracking()()).toBeUndefined();
  });

  it("allows calling the visibility-tracking no-op cleanup", () => {
    vi.stubGlobal("window", undefined);
    expect(startVisibilityTracking()()).toBeUndefined();
  });
});
