import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../core/client";
import { startScrollTracking } from "./scrolling";

vi.mock("../core/client", () => ({ track: vi.fn() }));

describe("scroll tracking", () => {
  let frames: FrameRequestCallback[];
  let scrollHeight: number;
  let scrollY: number;

  const flushFrame = () => {
    const callbacks = frames.splice(0);
    callbacks.forEach((callback) => callback(0));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    frames = [];
    scrollHeight = 2000;
    scrollY = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);
    vi.spyOn(document.documentElement, "scrollHeight", "get")
      .mockImplementation(() => scrollHeight);
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollY);
    vi.spyOn(Date, "now").mockReturnValue(10_000);
  });

  afterEach(() => vi.restoreAllMocks());

  it("records each depth milestone once and throttles scroll events", () => {
    const stop = startScrollTracking();
    scrollY = 1000;
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    expect(frames).toHaveLength(1);
    flushFrame();

    for (const depth of [25, 50, 75, 90, 100]) {
      expect(track).toHaveBeenCalledWith({
        type: "scroll_depth",
        path: window.location.pathname,
        context: { metadata: { depth } },
      });
    }
    expect(track).toHaveBeenCalledWith({
      type: "scroll",
      path: window.location.pathname,
      context: { metadata: { depth: 100 } },
    });

    vi.mocked(track).mockClear();
    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("handles a non-scrollable document", () => {
    scrollHeight = 500;
    const stop = startScrollTracking();
    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    expect(track).toHaveBeenCalledWith({
      type: "scroll",
      path: window.location.pathname,
      context: { metadata: { depth: 100 } },
    });
    stop();
  });

  it("records intermediate depth and a later scroll after throttling", () => {
    const now = vi.spyOn(Date, "now");
    const stop = startScrollTracking();
    scrollY = 500;
    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    expect(track).toHaveBeenCalledWith({
      type: "scroll",
      path: window.location.pathname,
      context: { metadata: { depth: 50 } },
    });
    now.mockReturnValue(16_000);
    scrollY = 750;
    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    expect(track).toHaveBeenCalledWith({
      type: "scroll",
      path: window.location.pathname,
      context: { metadata: { depth: 75 } },
    });
    stop();
  });

  it("records a later scroll without repeating reached milestones", () => {
    const now = vi.spyOn(Date, "now");
    const stop = startScrollTracking();
    scrollY = 500;
    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    vi.mocked(track).mockClear();
    now.mockReturnValue(16_000);
    window.dispatchEvent(new Event("scroll"));
    flushFrame();
    expect(track).toHaveBeenCalledExactlyOnceWith({
      type: "scroll",
      path: window.location.pathname,
      context: { metadata: { depth: 50 } },
    });
    stop();
  });

});
