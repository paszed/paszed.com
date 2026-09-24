// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("../core/client", () => ({ track: vi.fn() }));

import { startCtaExposureTracking } from "./cta-exposure";
import { startDiscoveryTracking } from "./discovery-observer";
import { startDwellTracking } from "./dwell";
import { startNavigationTracking } from "./navigation";
import { startScrollTracking } from "./scrolling";

describe("analytics collection without a browser", () => {
  it("returns safe cleanup functions when window is unavailable", () => {
    expect(typeof window).toBe("undefined");

    const cleanups = [
      startCtaExposureTracking("/"),
      startDiscoveryTracking(),
      startDwellTracking(),
      startNavigationTracking(),
      startScrollTracking(),
    ];

    for (const cleanup of cleanups) {
      expect(cleanup).toBeTypeOf("function");
      expect(cleanup()).toBeUndefined();
    }
  });
});
