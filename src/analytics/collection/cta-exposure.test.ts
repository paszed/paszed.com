import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../core/client";
import { startCtaExposureTracking } from "./cta-exposure";

vi.mock("../core/client", () => ({ track: vi.fn() }));

describe("CTA exposure tracking", () => {
  let intersectionCallback: IntersectionObserverCallback;
  let mutationCallback: MutationCallback;
  let observe: ReturnType<typeof vi.fn>;
  let unobserve: ReturnType<typeof vi.fn>;
  let disconnectIntersection: ReturnType<typeof vi.fn>;
  let disconnectMutation: ReturnType<typeof vi.fn>;
  let visibility: DocumentVisibilityState;

  function createCta(id = "home.hero.primary-cta") {
    const element = document.createElement("a");
    element.dataset.analyticsId = id;
    element.href = "/contact";
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, top: 0, left: 0,
      right: 100, bottom: 100, width: 100, height: 100,
      toJSON: () => ({}),
    });
    document.body.append(element);
    return element;
  }

  function intersect(element: Element, ratio = 1) {
    intersectionCallback([
      { target: element, intersectionRatio: ratio } as IntersectionObserverEntry,
    ], {} as IntersectionObserver);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    document.body.innerHTML = "";
    visibility = "visible";
    vi.spyOn(document, "visibilityState", "get")
      .mockImplementation(() => visibility);
    observe = vi.fn();
    unobserve = vi.fn();
    disconnectIntersection = vi.fn();
    disconnectMutation = vi.fn();
    vi.stubGlobal("IntersectionObserver", vi.fn(function (callback) {
      intersectionCallback = callback;
      return { observe, unobserve, disconnect: disconnectIntersection };
    }));
    vi.stubGlobal("MutationObserver", vi.fn(function (callback) {
      mutationCallback = callback;
      return { observe: vi.fn(), disconnect: disconnectMutation };
    }));
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("records a visible CTA after one second, only once", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    expect(observe).toHaveBeenCalledWith(element);
    intersect(element);
    intersect(element);
    vi.advanceTimersByTime(999);
    expect(track).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(track).toHaveBeenCalledWith({
      type: "cta_exposure",
      path: "/",
      context: { metadata: {
        analyticsId: "home.hero.primary-cta",
        threshold: 0.5,
        durationMs: 1000,
      } },
    });
    expect(unobserve).toHaveBeenCalledWith(element);
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).toHaveBeenCalledOnce();
    stop();
  });

  it("cancels pending exposure when intersection drops below threshold", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    intersect(element);
    intersect(element, 0.25);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).toHaveBeenCalledOnce();
    stop();
  });

  it("does not record hidden, detached, or insufficiently visible CTAs", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    visibility = "hidden";
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();

    visibility = "visible";
    intersect(element);
    element.remove();
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("rejects elements with zero area or insufficient viewport overlap", () => {
    const element = createCta();
    const rect = vi.spyOn(element, "getBoundingClientRect");
    const stop = startCtaExposureTracking("/");
    rect.mockReturnValueOnce({
      x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0,
      width: 0, height: 0, toJSON: () => ({}),
    });
    intersect(element);
    expect(track).not.toHaveBeenCalled();
    rect.mockReturnValueOnce({
      x: -90, y: 0, top: 0, left: -90, right: 10, bottom: 100,
      width: 100, height: 100, toJSON: () => ({}),
    });
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("cancels pending exposure on visibility change and cleanup", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    intersect(element);
    visibility = "hidden";
    document.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();

    visibility = "visible";
    document.dispatchEvent(new Event("visibilitychange"));
    stop();
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    expect(disconnectIntersection).toHaveBeenCalledOnce();
    expect(disconnectMutation).toHaveBeenCalledOnce();
  });

  it("observes CTAs added after initialization", () => {
    const stop = startCtaExposureTracking("/");
    const element = createCta("about.contact.cta");
    mutationCallback([], {} as MutationObserver);
    expect(observe).toHaveBeenCalledWith(element);
    stop();
  });

  it("rejects CTAs with zero height", () => {
    const element = createCta();
    const rect = vi.spyOn(element, "getBoundingClientRect");
    const stop = startCtaExposureTracking("/");
    rect.mockReturnValueOnce({
      x: 0, y: 0, top: 0, left: 0, right: 100, bottom: 0,
      width: 100, height: 0, toJSON: () => ({}),
    });
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("does not record exposure if the CTA becomes hidden during the delay", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    intersect(element);
    visibility = "hidden";
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("does not record exposure if viewport overlap decreases during the delay", () => {
    const element = createCta();
    const rect = vi.spyOn(element, "getBoundingClientRect");
    const stop = startCtaExposureTracking("/");
    intersect(element);
    rect.mockReturnValueOnce({
      x: -90, y: 0, top: 0, left: -90, right: 10, bottom: 100,
      width: 100, height: 100, toJSON: () => ({}),
    });
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });


  it("returns a safe cleanup when IntersectionObserver is unavailable", () => {
    const original = Object.getOwnPropertyDescriptor(window, "IntersectionObserver");
    Reflect.deleteProperty(window, "IntersectionObserver");

    try {
      const cleanup = startCtaExposureTracking("/");
      expect(cleanup()).toBeUndefined();
    } finally {
      if (original) {
        Object.defineProperty(window, "IntersectionObserver", original);
      }
    }
  });

  it("rejects a CTA whose visible area is below the threshold", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, top: 0, left: 0,
      right: 100, bottom: 100, width: 100, height: 100,
      toJSON: () => ({}),
    });
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(40);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(40);
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("ignores an intersection entry with insufficient overlap", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    intersect(element, 0.1);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });


  it("handles a non-HTML CTA candidate", () => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttribute("data-analytics-id", "home.hero.primary-cta");
    document.body.append(element);
    const stop = startCtaExposureTracking("/");
    expect(observe).not.toHaveBeenCalledWith(element);
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).not.toHaveBeenCalled();
    stop();
  });

  it("does not schedule exposure for a CTA already seen", () => {
    const element = createCta();
    const stop = startCtaExposureTracking("/");
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).toHaveBeenCalledOnce();
    intersect(element);
    vi.advanceTimersByTime(1000);
    expect(track).toHaveBeenCalledOnce();
    stop();
  });

});
