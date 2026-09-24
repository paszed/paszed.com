import { describe, expect, it } from "vitest";

import { site } from "@/config/site";
import { locales, localizePath } from "@/i18n";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const entries = sitemap();
  const routes = ["/", "/about", "/contact", "/projects", "/specs"] as const;

  it("includes every public page in every supported locale", () => {
    expect(entries).toHaveLength(routes.length * locales.length);

    const urls = entries.map((entry) => entry.url);
    for (const path of routes) {
      for (const locale of locales) {
        expect(urls).toContain(`${site.url}${localizePath(path, locale)}`);
      }
    }
  });

  it("uses the correct homepage URLs", () => {
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain(`${site.url}/`);
    expect(urls).toContain(`${site.url}/de`);
    expect(urls).toContain(`${site.url}/hu`);
    expect(urls).not.toContain(`${site.url}/de/`);
    expect(urls).not.toContain(`${site.url}/hu/`);
  });

  it("provides reciprocal alternates for each localized version", () => {
    for (const path of routes) {
      const expected = Object.fromEntries(
        locales.map((locale) => [
          locale,
          `${site.url}${localizePath(path, locale)}`,
        ]),
      );

      for (const url of Object.values(expected)) {
        const entry = entries.find((candidate) => candidate.url === url);
        expect(entry?.alternates?.languages).toEqual(expected);
      }
    }
  });

  it("does not list unavailable project detail pages", () => {
    expect(entries.some((entry) => /\/projects\/[^/]+$/.test(entry.url))).toBe(false);
  });
});
