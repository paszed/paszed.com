import type { Locale } from "@/i18n/config";
import type { ContactContent } from "@/features/contact/types";

import { deContact } from "./de";
import { enContact } from "./en";
import { huContact } from "./hu";

const contactContent: Record<Locale, ContactContent> = {
  en: enContact,
  de: deContact,
  hu: huContact,
};

export function getContact(locale: Locale): ContactContent {
  return contactContent[locale];
}

