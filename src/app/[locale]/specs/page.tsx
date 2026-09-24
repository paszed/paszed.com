import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";

import { getSpecs } from "@/content/specs";
import { SpecsView } from "@/features/specs/components";
import { isLocale } from "@/i18n";
import { PageHero } from "@/ui/patterns";

interface SpecsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SpecsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const content = getSpecs(locale);

  return createPageMetadata({
    title: content.title,
    description: content.description,
    path: "/specs",
    locale,
  });
}

export default async function SpecsPage({ params }: SpecsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) return null;

  const content = getSpecs(locale);

  return (
    <div>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        titleEmphasis={content.titleEmphasis}
        description={content.description}
      />
      <SpecsView content={content} locale={locale} />
    </div>
  );
}
