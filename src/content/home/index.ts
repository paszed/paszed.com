import type { Locale } from "@/i18n/config";

import { deHome } from "./de";
import { enHome } from "./en";
import { huHome } from "./hu";
import type { HomeContent } from "@/features/home/types/home";

export const homeContent: Record<Locale, HomeContent> = {
  en: enHome,
  de: deHome,
  hu: huHome,
};

export function getHome(locale: Locale): HomeContent {
  return homeContent[locale];
}

export { deHome, enHome, huHome };
