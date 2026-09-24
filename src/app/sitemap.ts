import type { MetadataRoute } from "next";

import { site } from "@/config/site";
import { locales, localizePath } from "@/i18n";

const routes = ["/", "/about", "/contact", "/projects", "/specs"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [
        locale,
        `${site.url}${localizePath(path, locale)}`,
      ]),
    );

    return locales.map((locale) => ({
      url: `${site.url}${localizePath(path, locale)}`,
      alternates: {
        languages,
      },
      changeFrequency: path === "/" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    }));
  });
}
