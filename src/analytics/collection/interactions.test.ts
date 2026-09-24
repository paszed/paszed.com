import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../core/client";
import {
  trackInteraction,
  trackProjectOpen,
  trackProjectExpand,
  trackGithubClick,
  trackDownload,
  trackCopy,
  trackFormInteraction,
} from "./interactions";

vi.mock("../core/client", () => ({ track: vi.fn() }));

describe("interaction tracking", () => {
  beforeEach(() => vi.clearAllMocks());

  it("records an interaction without optional metadata", () => {
    trackInteraction({ type: "click" });
    expect(track).toHaveBeenCalledWith({
      type: "click",
      path: window.location.pathname,
      context: { metadata: {} },
    });
  });

  it("records target and custom metadata", () => {
    trackInteraction({
      type: "click",
      target: "primary-cta",
      metadata: { source: "hero" },
    });
    expect(track).toHaveBeenCalledWith({
      type: "click",
      path: window.location.pathname,
      context: { metadata: { target: "primary-cta", source: "hero" } },
    });
  });

  it.each([
    ["project_open", trackProjectOpen],
    ["project_expand", trackProjectExpand],
    ["github_click", trackGithubClick],
    ["download", trackDownload],
    ["copy", trackCopy],
  ] as const)("records %s", (type, record) => {
    record("example");
    expect(track).toHaveBeenCalledWith({
      type,
      path: window.location.pathname,
      context: { metadata: { target: "example" } },
    });
  });

  it("records form interactions with and without metadata", () => {
    trackFormInteraction("contact");
    trackFormInteraction("contact", { field: "email" });
    expect(track).toHaveBeenNthCalledWith(1, {
      type: "form_interaction",
      path: window.location.pathname,
      context: { metadata: { target: "contact" } },
    });
    expect(track).toHaveBeenNthCalledWith(2, {
      type: "form_interaction",
      path: window.location.pathname,
      context: { metadata: { target: "contact", field: "email" } },
    });
  });
});
