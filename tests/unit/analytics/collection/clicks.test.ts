import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startClickTracking } from "../../../../src/analytics/collection/clicks";
import { trackInteraction } from "../../../../src/analytics/collection/interactions";

vi.mock("../../../../src/analytics/collection/interactions", () => ({
  trackInteraction: vi.fn(),
}));

describe("startClickTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/current");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a callable no-op cleanup on the server", () => {
    vi.stubGlobal("window", undefined);
    expect(startClickTracking()()).toBeUndefined();
  });

  it("ignores clicks without an Element target", () => {
    const stop = startClickTracking();
    document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(trackInteraction).not.toHaveBeenCalled();
    stop();
  });

  it("ignores noninteractive elements", () => {
    const stop = startClickTracking();
    const element = document.createElement("div");
    document.body.append(element);
    element.click();
    expect(trackInteraction).not.toHaveBeenCalled();
    stop();
    element.remove();
  });

  it("tracks a nested button click with its analytics ID", () => {
    const stop = startClickTracking();
    const button = document.createElement("button");
    button.dataset.analyticsId = "primary";
    const child = document.createElement("span");
    button.append(child);
    document.body.append(button);
    child.click();
    expect(trackInteraction).toHaveBeenCalledWith({
      type: "click",
      target: "button",
      metadata: { analyticsId: "primary" },
    });
    stop();
    button.remove();
  });

  it("tracks internal anchor destinations", () => {
    const stop = startClickTracking();
    const anchor = document.createElement("a");
    anchor.href = "/pricing?plan=pro";
    document.body.append(anchor);
    anchor.click();
    expect(trackInteraction).toHaveBeenCalledWith({
      type: "click",
      target: "a",
      metadata: { destinationPath: "/pricing" },
    });
    stop();
    anchor.remove();
  });

  it("tracks external HTTP anchor hosts", () => {
    const stop = startClickTracking();
    const anchor = document.createElement("a");
    anchor.href = "https://example.com/path";
    document.body.append(anchor);
    anchor.click();
    expect(trackInteraction).toHaveBeenCalledWith({
      type: "click",
      target: "a",
      metadata: { destinationHost: "example.com" },
    });
    stop();
    anchor.remove();
  });

  it("omits the destination host for non-HTTP links", () => {
    const stop = startClickTracking();
    const anchor = document.createElement("a");
    anchor.href = "mailto:hello@example.com";
    document.body.append(anchor);
    anchor.click();
    expect(trackInteraction).toHaveBeenCalledWith({
      type: "click",
      target: "a",
      metadata: {},
    });
    stop();
    anchor.remove();
  });

  it("removes its click listener on cleanup", () => {
    const stop = startClickTracking();
    const button = document.createElement("button");
    document.body.append(button);
    stop();
    button.click();
    expect(trackInteraction).not.toHaveBeenCalled();
    button.remove();
  });
});
