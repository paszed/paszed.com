import {
  defaultLocale,
  locales,
  type Locale,
} from "./config";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getLocale(value?: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function localizePath(href: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return href;
  }

  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}
