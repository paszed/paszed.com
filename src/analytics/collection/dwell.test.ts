import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../core/client";
import { startDwellTracking } from "./dwell";

vi.mock("../core/client", () => ({ track: vi.fn() }));

describe("dwell tracking", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.spyOn(document, "hasFocus").mockReturnValue(true);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("records active dwell time and stops after cleanup", () => {
    const stop = startDwellTracking();
    vi.advanceTimersByTime(15_000);
    expect(track).toHaveBeenCalledWith({
      type: "dwell",
      path: window.location.pathname,
      context: { metadata: { activeMs: 15_000 } },
    });
    stop();
    vi.advanceTimersByTime(15_000);
    expect(track).toHaveBeenCalledTimes(1);
  });

  it("does not record while hidden or unfocused", () => {
    vi.spyOn(document, "hasFocus").mockReturnValue(false);
    const stop = startDwellTracking();
    vi.advanceTimersByTime(15_000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("updates active time on visibility, focus, and blur", () => {
    const focus = vi.spyOn(document, "hasFocus");
    const stop = startDwellTracking();
    vi.advanceTimersByTime(3_000);
    focus.mockReturnValue(false);
    window.dispatchEvent(new Event("blur"));
    vi.advanceTimersByTime(4_000);
    focus.mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));
    vi.advanceTimersByTime(15_000);
    expect(track).toHaveBeenCalledWith({
      type: "dwell",
      path: window.location.pathname,
      context: { metadata: { activeMs:  11_000 } },
    });
    stop();
  });

  it("does not accumulate inactive time after visibility changes", () => {
    const visibility = vi.spyOn(document, "visibilityState", "get");
    const stop = startDwellTracking();
    vi.advanceTimersByTime(3_000);
    visibility.mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(7_000);
    visibility.mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(15_000);
    expect(track).toHaveBeenCalledWith({
      type: "dwell",
      path: window.location.pathname,
      context: { metadata: { activeMs: 8_000 } },
    });
    stop();
  });

});
