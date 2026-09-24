import type { Locale } from "@/i18n/config";
import type { AboutContent } from "@/features/about/types";

import { deAbout } from "./de";
import { enAbout } from "./en";
import { huAbout } from "./hu";

export const aboutContent: Record<Locale, AboutContent> = {
  en: enAbout,
  de: deAbout,
  hu: huAbout,
};

export function getAbout(locale: Locale): AboutContent {
  return aboutContent[locale];
}

export { deAbout, enAbout, huAbout };
