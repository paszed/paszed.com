import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../core/client";
import { startNavigationTracking } from "./navigation";

vi.mock("../core/client", () => ({ track: vi.fn() }));

describe("navigation tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/");
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("stamps history state and tracks backward and forward navigation", () => {
    const stop = startNavigationTracking();
    expect(window.history.state.analyticsIndex).toBe(0);

    window.history.pushState({ page: "about" }, "", "/about");
    expect(window.history.state).toEqual({ page: "about", analyticsIndex: 1 });

    window.history.replaceState({ page: "updated" }, "", "/about");
    expect(window.history.state).toEqual({ page: "updated", analyticsIndex: 1 });

    window.dispatchEvent(new PopStateEvent("popstate", {
      state: { analyticsIndex: 0 },
    }));
    expect(track).toHaveBeenCalledWith({
      type: "back_navigation",
      path: window.location.pathname,
      context: { metadata: { fromIndex: 1, toIndex: 0 } },
    });

    window.dispatchEvent(new PopStateEvent("popstate", {
      state: { analyticsIndex: 2 },
    }));
    expect(track).toHaveBeenCalledWith({
      type: "forward_navigation",
      path: window.location.pathname,
      context: { metadata: { fromIndex: 0, toIndex: 2 } },
    });

    const count = vi.mocked(track).mock.calls.length;
    window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
    expect(track).toHaveBeenCalledTimes(count);
    stop();
  });

  it("resumes an existing history index and handles primitive state", () => {
    window.sessionStorage.setItem("paszed:analytics:history-index", "3");
    window.history.replaceState({ analyticsIndex: 3 }, "", "/");
    const stop = startNavigationTracking();
    window.history.pushState(null, "", "/next");
    expect(window.history.state).toEqual({ analyticsIndex: 4 });
    stop();
  });

  it("ignores non-links and internal links, but tracks external links", () => {
    const stop = startNavigationTracking();
    const button = document.createElement("button");
    const internal = document.createElement("a");
    internal.href = "/about";
    const external = document.createElement("a");
    external.href = "https://example.com/docs";
    const child = document.createElement("span");
    external.append(child);
    document.body.append(button, internal, external);

    button.click();
    internal.click();
    expect(track).not.toHaveBeenCalled();

    child.click();
    expect(track).toHaveBeenCalledWith({
      type: "external_navigation",
      path: window.location.pathname,
      context: {
        metadata: { hostname: "example.com", protocol: "https:" },
      },
    });
    stop();
  });

  it("handles an invalid stored history index", () => {
    window.sessionStorage.setItem("paszed:analytics:history-index", "invalid");
    const stop = startNavigationTracking();
    expect(window.history.state.analyticsIndex).toBe(0);
    stop();
  });

  it("preserves existing state when initializing history tracking", () => {
    window.history.replaceState({ page: "initial" }, "", "/");
    const stop = startNavigationTracking();
    expect(window.history.state).toEqual({ page: "initial", analyticsIndex: 0 });
    stop();
  });

  it("stamps primitive replacement state", () => {
    const stop = startNavigationTracking();
    window.history.replaceState("updated", "", "/");
    expect(window.history.state).toEqual({ analyticsIndex: 0 });
    stop();
  });

  it("ignores clicks whose target is not an element", () => {
    const stop = startNavigationTracking();
    const text = document.createTextNode("text");
    document.body.append(text);
    text.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(track).not.toHaveBeenCalled();
    stop();
  });

});
