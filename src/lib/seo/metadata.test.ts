import { describe, expect, it } from "vitest";

import { site } from "@/config/site";
import { createPageMetadata } from "./metadata";

describe("createPageMetadata", () => {
  it.each([
    ["en", "/", `${site.url}/`],
    ["de", "/", `${site.url}/de`],
    ["hu", "/", `${site.url}/hu`],
    ["en", "/about", `${site.url}/about`],
    ["de", "/about", `${site.url}/de/about`],
    ["hu", "/about", `${site.url}/hu/about`],
  ] as const)("sets the canonical for %s %s", (locale, path, canonical) => {
    const metadata = createPageMetadata({
      title: "Test page",
      description: "Test description",
      path,
      locale,
    });

    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.openGraph).toMatchObject({
      url: canonical,
      title: "Test page",
      description: "Test description",
    });
  });

  it("provides reciprocal language alternates and an English default", () => {
    const metadata = createPageMetadata({
      title: "About",
      description: "About page",
      path: "/about",
      locale: "hu",
    });

    expect(metadata.alternates?.languages).toEqual({
      en: `${site.url}/about`,
      de: `${site.url}/de/about`,
      hu: `${site.url}/hu/about`,
      "x-default": `${site.url}/about`,
    });
    expect(metadata.openGraph).toMatchObject({ locale: "hu_HU" });
  });
});
