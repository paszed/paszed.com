import { describe, expect, it } from "vitest";
import { getLocale, isLocale, localizePath } from "./routing";

describe("isLocale", () => {
  it("accepts supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(true);
    expect(isLocale("hu")).toBe(true);
  });

  it("rejects unsupported values", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("EN")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

describe("getLocale", () => {
  it("returns a supported locale unchanged", () => {
    expect(getLocale("de")).toBe("de");
    expect(getLocale("hu")).toBe("hu");
  });

  it("falls back to English for unsupported values", () => {
    expect(getLocale("fr")).toBe("en");
    expect(getLocale(undefined)).toBe("en");
  });
});

describe("localizePath", () => {
  it("keeps default-locale paths unchanged", () => {
    expect(localizePath("/", "en")).toBe("/");
    expect(localizePath("/projects", "en")).toBe("/projects");
  });

  it("prefixes non-default locale paths", () => {
    expect(localizePath("/", "de")).toBe("/de");
    expect(localizePath("/projects", "de")).toBe("/de/projects");
    expect(localizePath("/specs", "hu")).toBe("/hu/specs");
  });
});
