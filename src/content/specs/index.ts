import type { Locale } from "@/i18n/config";
import type { SpecsContent } from "@/features/specs/types";

import { deSpecs } from "./de";
import { enSpecs } from "./en";
import { huSpecs } from "./hu";

export const specsContent: Record<Locale, SpecsContent> = {
  en: enSpecs,
  de: deSpecs,
  hu: huSpecs,
};

export function getSpecs(locale: Locale): SpecsContent {
  return specsContent[locale];
}

export { deSpecs, enSpecs, huSpecs };
