import type { Locale } from "@/i18n";
import { getLocale } from "@/i18n";

export function getLocaleFromPath(pathname: string): Locale {
  return getLocale(pathname.split("/")[1]);
}
