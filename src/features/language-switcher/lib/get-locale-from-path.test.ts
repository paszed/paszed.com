import { describe, expect, it } from "vitest";
import { getLocaleFromPath } from "./get-locale-from-path";

describe("getLocaleFromPath", () => {
  it("detects supported locale prefixes", () => {
    expect(getLocaleFromPath("/de")).toBe("de");
    expect(getLocaleFromPath("/de/projects")).toBe("de");
    expect(getLocaleFromPath("/hu/specs")).toBe("hu");
  });

  it("defaults to English when no supported prefix exists", () => {
    expect(getLocaleFromPath("/")).toBe("en");
    expect(getLocaleFromPath("/projects")).toBe("en");
    expect(getLocaleFromPath("/fr/about")).toBe("en");
  });
});
