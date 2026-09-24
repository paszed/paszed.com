import { describe, expect, it } from "vitest";

import { resolveLocale } from "./resolve-locale";

describe("resolveLocale", () => {
  it("prioritizes a valid saved locale over browser preferences", () => {
    expect(resolveLocale("hu", "de-DE,de;q=0.9")).toBe("hu");
    expect(resolveLocale("en", "hu-HU")).toBe("en");
  });

  it("uses the browser language when no valid preference is saved", () => {
    expect(resolveLocale(undefined, "de-AT,de;q=0.9,en;q=0.8")).toBe("de");
    expect(resolveLocale("fr", "hu-HU,hu;q=0.9")).toBe("hu");
  });

  it("uses quality weights rather than header order", () => {
    expect(resolveLocale(undefined, "de;q=0.3,hu;q=0.9,en;q=0.5")).toBe("hu");
  });

  it("preserves header order when quality weights are equal", () => {
    expect(resolveLocale(undefined, "hu;q=0.8,de;q=0.8")).toBe("hu");
  });

  it("ignores disabled, invalid, and out-of-range quality values", () => {
    expect(resolveLocale(undefined, "de;q=0,hu;q=0.7")).toBe("hu");
    expect(resolveLocale(undefined, "de;q=invalid,hu;q=0.7")).toBe("hu");
    expect(resolveLocale(undefined, "de;q=2,hu;q=0.7")).toBe("hu");
  });

  it("ignores unsupported languages", () => {
    expect(resolveLocale(undefined, "fr-FR,es;q=0.9,de;q=0.8")).toBe("de");
  });

  it("defaults to English when no supported language is available", () => {
    expect(resolveLocale(undefined, null)).toBe("en");
    expect(resolveLocale(undefined, "fr-FR,es;q=0.8")).toBe("en");
    expect(resolveLocale(undefined, "")).toBe("en");
  });

  it("accepts case-insensitive browser language tags", () => {
    expect(resolveLocale(undefined, "DE-at")).toBe("de");
  });

  it("handles whitespace and additional parameters", () => {
    expect(resolveLocale(undefined, " fr ; q=0.9, de-CH ; foo=bar ; q=0.8 ")).toBe("de");
  });
});

