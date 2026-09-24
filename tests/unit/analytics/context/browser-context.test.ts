import { afterEach, describe, expect, it, vi } from "vitest";
import { getBrowserContext } from "../../../../src/analytics/context/browser";
import { getLocaleContext } from "../../../../src/analytics/context/locale";
import { getReferrerContext } from "../../../../src/analytics/context/referrer";
import { getViewportContext } from "../../../../src/analytics/context/viewport";

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.lang = "";
});

describe("getLocaleContext", () => {
  it("returns the document language", () => {
    document.documentElement.lang = "hu";
    expect(getLocaleContext()).toEqual({ locale: "hu" });
  });
  it("returns an empty object when no language is set", () => {
    document.documentElement.lang = "";
    expect(getLocaleContext()).toEqual({});
  });
});

describe("getReferrerContext", () => {
  it.each(["https://EXAMPLE.COM/path", "http://EXAMPLE.COM/path"])("extracts the hostname from %s", (referrer) => {
    vi.spyOn(document, "referrer", "get").mockReturnValue(referrer);
    expect(getReferrerContext()).toEqual({ referrer: "example.com" });
  });
  it("returns an empty object for a missing referrer", () => {
    vi.spyOn(document, "referrer", "get").mockReturnValue("");
    expect(getReferrerContext()).toEqual({});
  });
  it("rejects unsupported protocols", () => {
    vi.spyOn(document, "referrer", "get").mockReturnValue("ftp://example.com/file");
    expect(getReferrerContext()).toEqual({});
  });
  it("handles malformed referrers", () => {
    vi.spyOn(document, "referrer", "get").mockReturnValue("not a valid URL");
    expect(getReferrerContext()).toEqual({});
  });
});

describe("getViewportContext", () => {
  it("returns the current viewport dimensions", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1440);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(900);
    expect(getViewportContext()).toEqual({ viewport: { width: 1440, height: 900 } });
  });
});

describe("getBrowserContext", () => {
  it("combines locale, referrer, viewport, user agent, and traffic classification", () => {
    document.documentElement.lang = "de";
    vi.spyOn(document, "referrer", "get").mockReturnValue("https://EXAMPLE.COM/article");
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1280);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(720);
    vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("Googlebot");
    expect(getBrowserContext()).toEqual({
      locale: "de",
      referrer: "example.com",
      viewport: { width: 1280, height: 720 },
      userAgent: "Googlebot",
      trafficClass: "crawler",
    });
  });
});
