import type { Locale } from "@/i18n/config";

import { deFooter } from "./de";
import { enFooter } from "./en";
import { huFooter } from "./hu";
import type { FooterContent } from "./types";

export const footerContent: Record<Locale, FooterContent> = {
  en: enFooter,
  de: deFooter,
  hu: huFooter,
};

export function getFooter(locale: Locale): FooterContent {
  return footerContent[locale];
}

export {
  deFooter,
  enFooter,
  huFooter,
};

export type { FooterContent };
