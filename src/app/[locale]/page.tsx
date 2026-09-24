import type { Metadata } from "next";

import { JsonLd } from "@/lib/seo/components/json-ld";
import { createPersonSchema } from "@/lib/seo/person-schema";
import { createWebsiteSchema } from "@/lib/seo/website-schema";

import { createPageMetadata } from "@/lib/seo/metadata";

import {
  ContactSection,
  Hero,
  HomeSection,
  IntroductionSection,
} from "@/features/home/components";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const content = isLocale(locale) ? getHome(locale) : getHome("en");

  return createPageMetadata({
    title: content.hero.title,
    description: content.hero.description,
    path: "/",
    locale: isLocale(locale) ? locale : "en",
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) return null;

  const content = getHome(locale);

  return (
    <div>
      {locale === "en" ? (
        <>
          <JsonLd id="person-schema" data={createPersonSchema()} />
          <JsonLd id="website-schema" data={createWebsiteSchema()} />
        </>
      ) : null}
      <Hero content={content.hero} locale={locale} />
      <IntroductionSection content={content.introduction} />
      <HomeSection content={content.capabilities} variant="capabilities" />
      <HomeSection content={content.approach} variant="approach" />
      <ContactSection content={content.contact} />
    </div>
  );
}
