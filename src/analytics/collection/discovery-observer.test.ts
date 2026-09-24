import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackDiscovery } from "./discovery";
import { startDiscoveryTracking } from "./discovery-observer";

vi.mock("./discovery", () => ({ trackDiscovery: vi.fn() }));

describe("discovery observation", () => {
  let intersectionCallback: IntersectionObserverCallback;
  let mutationCallback: MutationCallback;
  let observeIntersection: ReturnType<typeof vi.fn>;
  let disconnectIntersection: ReturnType<typeof vi.fn>;
  let disconnectMutation: ReturnType<typeof vi.fn>;

  const intersect = (target: Element, isIntersecting = true) => {
    intersectionCallback([
      { target, isIntersecting } as IntersectionObserverEntry,
    ], {} as IntersectionObserver);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    observeIntersection = vi.fn();
    disconnectIntersection = vi.fn();
    disconnectMutation = vi.fn();
    vi.stubGlobal("IntersectionObserver", vi.fn(function (callback) {
      intersectionCallback = callback;
      return {
        observe: observeIntersection,
        unobserve: vi.fn(),
        disconnect: disconnectIntersection,
      };
    }));
    vi.stubGlobal("MutationObserver", vi.fn(function (callback) {
      mutationCallback = callback;
      return { observe: vi.fn(), disconnect: disconnectMutation };
    }));
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
  });

  it("observes existing elements and records each valid discovery once", () => {
    const element = document.createElement("section");
    element.dataset.analyticsDiscovery = "hardware";
    element.dataset.analyticsDiscoveryType = "specs_view";
    document.body.append(element);
    const stop = startDiscoveryTracking();
    expect(observeIntersection).toHaveBeenCalledWith(element);

    intersect(element, false);
    expect(trackDiscovery).not.toHaveBeenCalled();
    intersect(element);
    intersect(element);
    expect(trackDiscovery).toHaveBeenCalledOnce();
    expect(trackDiscovery).toHaveBeenCalledWith({
      type: "specs_view", target: "hardware",
    });
    stop();
    expect(disconnectIntersection).toHaveBeenCalledOnce();
    expect(disconnectMutation).toHaveBeenCalledOnce();
  });

  it.each([
    "offer_view", "service_view", "pricing_view", "specs_view",
    "capability_discovery",
  ])("accepts discovery type %s", (type) => {
    const element = document.createElement("div");
    element.dataset.analyticsDiscovery = type;
    element.dataset.analyticsDiscoveryType = type;
    document.body.append(element);
    const stop = startDiscoveryTracking();
    intersect(element);
    expect(trackDiscovery).toHaveBeenCalledWith({ type, target: type });
    stop();
  });

  it("ignores missing targets, invalid types, and non-HTML elements", () => {
    const stop = startDiscoveryTracking();
    const missing = document.createElement("div");
    missing.dataset.analyticsDiscoveryType = "offer_view";
    intersect(missing);

    const invalid = document.createElement("div");
    invalid.dataset.analyticsDiscovery = "unknown";
    invalid.dataset.analyticsDiscoveryType = "invalid";
    intersect(invalid);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    intersect(svg);
    expect(trackDiscovery).not.toHaveBeenCalled();
    stop();
  });

  it("observes added nodes, nested discovery elements, and attribute changes", () => {
    const stop = startDiscoveryTracking();
    const root = document.createElement("section");
    root.dataset.analyticsDiscovery = "root";
    const child = document.createElement("div");
    child.dataset.analyticsDiscovery = "child";
    root.append(child);

    mutationCallback([{
      type: "childList",
      addedNodes: [root, document.createTextNode("ignored")] as unknown as NodeList,
    } as unknown as MutationRecord], {} as MutationObserver);
    expect(observeIntersection).toHaveBeenCalledWith(root);
    expect(observeIntersection).toHaveBeenCalledWith(child);

    mutationCallback([{
      type: "attributes",
      target: root,
    } as unknown as MutationRecord], {} as MutationObserver);
    expect(observeIntersection).toHaveBeenCalledWith(root);
    stop();
  });

  it("ignores attribute mutations without a discovery attribute", () => {
    const stop = startDiscoveryTracking();
    const element = document.createElement("div");
    mutationCallback([{
      type: "attributes", target: element,
    } as unknown as MutationRecord], {} as MutationObserver);
    expect(observeIntersection).not.toHaveBeenCalled();
    stop();
  });

  it("ignores non-HTML attribute mutation targets", () => {
    const stop = startDiscoveryTracking();
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mutationCallback([{
      type: "attributes", target: element,
    } as unknown as MutationRecord], {} as MutationObserver);
    expect(observeIntersection).not.toHaveBeenCalled();
    stop();
  });

  it("ignores mutation records other than childList and attributes", () => {
    const stop = startDiscoveryTracking();
    mutationCallback([{
      type: "characterData", target: document.createTextNode("updated"),
    } as unknown as MutationRecord], {} as MutationObserver);
    expect(observeIntersection).not.toHaveBeenCalled();
    stop();
  });

});
