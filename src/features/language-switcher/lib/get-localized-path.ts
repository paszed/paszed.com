import type { Locale } from "@/i18n";
import { localizePath } from "@/i18n";

export function getLocalizedPath(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  const hasLocalePrefix = ["en", "de", "hu"].includes(segments[1]);
  const path = (hasLocalePrefix ? `/${segments.slice(2).join("/")}` : pathname) || "/";
  return localizePath(path, locale);
}
