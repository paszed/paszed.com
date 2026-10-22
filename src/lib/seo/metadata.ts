import type { Metadata } from "next";

import { site } from "@/config/site";
import { locales, localizePath, type Locale } from "@/i18n";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  locale: Locale;
}

export function createPageMetadata({
  title,
  description,
  path,
  locale,
}: PageMetadataOptions): Metadata {
  const url = `${site.url}${localizePath(path, locale)}`;
  const languages = Object.fromEntries(
    locales.map((language) => [
      language,
      `${site.url}${localizePath(path, language)}`,
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        "x-default": `${site.url}${localizePath(path, "en")}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: {
        en: "en_US",
        de: "de_DE",
        hu: "hu_HU",
      }[locale],
      images: [{
        url: "/brand/share-card.png",
        width: 1200,
        height: 630,
        alt: `${site.owner} — ${title}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@paszed_",
      images: ["/brand/share-card.png"],
    },
  };
}
