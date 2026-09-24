import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../../../../src/analytics/core/client";
import {
  trackContactCta,
  trackContactStart,
  trackContactSubmit,
  trackConversion,
} from "../../../../src/analytics/collection/conversion";
import { trackDiscovery } from "../../../../src/analytics/collection/discovery";

vi.mock("../../../../src/analytics/core/client", () => ({
  track: vi.fn(),
}));

describe("conversion tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/contact");
  });

  it("tracks a conversion without optional metadata", () => {
    trackConversion("contact_cta");
    expect(track).toHaveBeenCalledWith({
      type: "contact_cta",
      path: "/contact",
      context: { metadata: {} },
    });
  });

  it("merges target and custom metadata", () => {
    trackConversion("contact_submit", "form-a", { source: "footer" });
    expect(track).toHaveBeenCalledWith({
      type: "contact_submit",
      path: "/contact",
      context: { metadata: { target: "form-a", source: "footer" } },
    });
  });

  it("uses the default contact CTA target", () => {
    trackContactCta();
    expect(track).toHaveBeenCalledWith({
      type: "contact_cta",
      path: "/contact",
      context: { metadata: { target: "contact" } },
    });
  });

  it("accepts a custom contact CTA target", () => {
    trackContactCta("hero");
    expect(track).toHaveBeenCalledWith({
      type: "contact_cta",
      path: "/contact",
      context: { metadata: { target: "hero" } },
    });
  });

  it("uses the default contact-start target", () => {
    trackContactStart();
    expect(track).toHaveBeenCalledWith({
      type: "contact_start",
      path: "/contact",
      context: { metadata: { target: "contact-form" } },
    });
  });

  it("accepts a custom contact-start target", () => {
    trackContactStart("modal");
    expect(track).toHaveBeenCalledWith({
      type: "contact_start",
      path: "/contact",
      context: { metadata: { target: "modal" } },
    });
  });

  it("uses the default contact-submit target", () => {
    trackContactSubmit();
    expect(track).toHaveBeenCalledWith({
      type: "contact_submit",
      path: "/contact",
      context: { metadata: { target: "contact-form" } },
    });
  });

  it("accepts a custom contact-submit target", () => {
    trackContactSubmit("sidebar");
    expect(track).toHaveBeenCalledWith({
      type: "contact_submit",
      path: "/contact",
      context: { metadata: { target: "sidebar" } },
    });
  });
});

describe("discovery tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/services");
  });

  it("tracks a discovery event without optional metadata", () => {
    trackDiscovery({ type: "offer_view", target: "offer-a" });
    expect(track).toHaveBeenCalledWith({
      type: "offer_view",
      path: "/services",
      context: { metadata: { target: "offer-a" } },
    });
  });

  it("merges custom discovery metadata", () => {
    trackDiscovery({
      type: "capability_discovery",
      target: "analytics",
      metadata: { source: "navigation" },
    });
    expect(track).toHaveBeenCalledWith({
      type: "capability_discovery",
      path: "/services",
      context: { metadata: { target: "analytics", source: "navigation" } },
    });
  });
});
