import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";

import { getContact } from "@/content/contact";
import { ContactView } from "@/features/contact/components";
import { isLocale } from "@/i18n";
import { PageHero } from "@/ui/patterns";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const content = getContact(locale);

  return createPageMetadata({
    title: content.title,
    description: content.description,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) return null;

  const content = getContact(locale);

  return (
    <div>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <ContactView content={content} />
    </div>
  );
}
