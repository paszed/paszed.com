import { defaultLocale, type Locale } from "./config";
import { isLocale } from "./routing";

export function resolveLocale(
  savedLocale: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (isLocale(savedLocale)) return savedLocale;

  const preferences = (acceptLanguage ?? "")
    .split(",")
    .map((entry, index) => {
      const [tag, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));

      const quality = qualityParameter
        ? Number(qualityParameter.slice(2))
        : 1;

      return {
        language: tag.trim().split("-")[0]?.toLowerCase(),
        quality,
        index,
      };
    })
    .filter(
      (preference) =>
        Number.isFinite(preference.quality) &&
        preference.quality > 0 &&
        preference.quality <= 1,
    )
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const preference of preferences) {
    if (isLocale(preference.language)) return preference.language;
  }

  return defaultLocale;
}

