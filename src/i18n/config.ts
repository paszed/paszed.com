export const locales = ["en", "de", "hu"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";


