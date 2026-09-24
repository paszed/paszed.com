import type { Locale } from "@/i18n";
import { localizePath } from "@/i18n";

export function getLocalizedPath(pathname: string, locale: Locale) {
  const path = pathname.replace(/^\/(en|de|hu)/, "") || "/";
  return localizePath(path, locale);
}
