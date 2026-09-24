import type { Locale } from "@/i18n/config";

import { deNavigation } from "./de";
import { enNavigation } from "./en";
import { huNavigation } from "./hu";
import type { NavigationContent } from "@/types/navigation";

export const navigationContent: Record<Locale, NavigationContent> = {
  en: enNavigation,
  de: deNavigation,
  hu: huNavigation,
};

export function getNavigation(locale: Locale): NavigationContent {
  return navigationContent[locale];
}

export { deNavigation, enNavigation, huNavigation };
export type { NavigationContent };
