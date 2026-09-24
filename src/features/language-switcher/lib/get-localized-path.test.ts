import { describe, expect, it } from "vitest";
import { getLocalizedPath } from "./get-localized-path";

describe("getLocalizedPath", () => {
  it("localizes the homepage", () => {
    expect(getLocalizedPath("/", "en")).toBe("/");
    expect(getLocalizedPath("/", "de")).toBe("/de");
    expect(getLocalizedPath("/", "hu")).toBe("/hu");
  });

  it("replaces an existing locale prefix", () => {
    expect(getLocalizedPath("/de/projects", "hu")).toBe("/hu/projects");
    expect(getLocalizedPath("/hu/about", "en")).toBe("/about");
    expect(getLocalizedPath("/en/contact", "de")).toBe("/de/contact");
  });

  it("preserves paths without a locale prefix", () => {
    expect(getLocalizedPath("/projects", "de")).toBe("/de/projects");
    expect(getLocalizedPath("/design", "hu")).toBe("/hu/design");
    expect(getLocalizedPath("/human", "de")).toBe("/de/human");
    expect(getLocalizedPath("/english", "hu")).toBe("/hu/english");
  });

  it("handles an empty pathname", () => {
    expect(getLocalizedPath("", "en")).toBe("/");
    expect(getLocalizedPath("", "de")).toBe("/de");
    expect(getLocalizedPath("", "hu")).toBe("/hu");
  });
});
