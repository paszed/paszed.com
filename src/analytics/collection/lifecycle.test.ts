import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../core/client";
import { startClickTracking } from "./clicks";
import { startCtaExposureTracking } from "./cta-exposure";
import { startDiscoveryTracking } from "./discovery-observer";
import { startDwellTracking } from "./dwell";
import { startExitTracking } from "./exit";
import { startHeartbeat } from "./heartbeat";
import { startNavigationTracking } from "./navigation";
import { startScrollTracking } from "./scrolling";
import { startSession } from "./session";
import { startVisibilityTracking } from "./visibility";
import {
  recordRouteAnalytics,
  startGlobalAnalytics,
  startRouteAnalytics,
} from "./lifecycle";

vi.mock("../core/client", () => ({ track: vi.fn() }));
vi.mock("./clicks", () => ({ startClickTracking: vi.fn() }));
vi.mock("./cta-exposure", () => ({ startCtaExposureTracking: vi.fn() }));
vi.mock("./discovery-observer", () => ({ startDiscoveryTracking: vi.fn() }));
vi.mock("./dwell", () => ({ startDwellTracking: vi.fn() }));
vi.mock("./exit", () => ({ startExitTracking: vi.fn() }));
vi.mock("./heartbeat", () => ({ startHeartbeat: vi.fn() }));
vi.mock("./navigation", () => ({ startNavigationTracking: vi.fn() }));
vi.mock("./scrolling", () => ({ startScrollTracking: vi.fn() }));
vi.mock("./session", () => ({ startSession: vi.fn() }));
vi.mock("./visibility", () => ({ startVisibilityTracking: vi.fn() }));

describe("analytics lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const start of [
      startClickTracking, startCtaExposureTracking, startDiscoveryTracking,
      startDwellTracking, startExitTracking, startHeartbeat,
      startNavigationTracking, startScrollTracking, startVisibilityTracking,
    ]) {
      vi.mocked(start).mockReturnValue(vi.fn());
    }
  });

  it("starts and stops global collectors", () => {
    const stop = startGlobalAnalytics();
    stop();
    for (const start of [
      startClickTracking, startExitTracking,
      startNavigationTracking, startVisibilityTracking,
    ]) {
      expect(start).toHaveBeenCalledOnce();
      expect(vi.mocked(start).mock.results[0]?.value).toHaveBeenCalledOnce();
    }
  });

  it("records session start, route transitions, and page views", () => {
    recordRouteAnalytics("/en", null);
    expect(startSession).toHaveBeenCalledWith("/en");
    expect(track).toHaveBeenCalledWith({ type: "page_view", path: "/en" });

    vi.clearAllMocks();
    recordRouteAnalytics("/de", "/en");
    expect(track).toHaveBeenCalledWith({
      type: "route_transition", path: "/de", previousPath: "/en",
    });
    expect(track).toHaveBeenCalledWith({
      type: "page_view", path: "/de", previousPath: "/en",
    });

    vi.clearAllMocks();
    recordRouteAnalytics("/de", "/de");
    expect(track).toHaveBeenCalledOnce();
    expect(track).toHaveBeenCalledWith({
      type: "page_view", path: "/de", previousPath: "/de",
    });
  });

  it("starts and stops route collectors", () => {
    const stop = startRouteAnalytics("/de");
    expect(startHeartbeat).toHaveBeenCalledWith("/de");
    expect(startCtaExposureTracking).toHaveBeenCalledWith("/de");
    for (const start of [
      startHeartbeat, startCtaExposureTracking, startDwellTracking,
      startDiscoveryTracking, startScrollTracking,
    ]) {
      expect(start).toHaveBeenCalledOnce();
    }
    stop();
    for (const start of [
      startHeartbeat, startCtaExposureTracking, startDwellTracking,
      startDiscoveryTracking, startScrollTracking,
    ]) {
      expect(vi.mocked(start).mock.results[0]?.value).toHaveBeenCalledOnce();
    }
  });
});
