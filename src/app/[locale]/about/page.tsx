import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";

import { getAbout } from "@/content/about";
import { AboutView } from "@/features/about/components";
import { isLocale } from "@/i18n";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const content = getAbout(locale);

  return createPageMetadata({
    title: content.title,
    description: content.introduction,
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) return null;

  return <AboutView content={getAbout(locale)} locale={locale} />;
}
