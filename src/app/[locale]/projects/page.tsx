import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";

import { getProjects } from "@/content/projects";
import { isLocale } from "@/i18n";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

const messages = {
  en: {
    title: "Projects",
    titleEmphasis: "coming soon",
    description: "I’m preparing a selection of work to share here.",
  },
  de: {
    title: "Projekte",
    titleEmphasis: "folgen in Kürze",
    description: "Ich bereite eine Auswahl meiner Arbeiten vor, die ich hier vorstellen werde.",
  },
  hu: {
    title: "Hamarosan érkeznek",
    titleEmphasis: "a projektek",
    description: "Hamarosan bemutatok itt néhány munkámat.",
  },
} as const;

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const content = getProjects(locale);

  return createPageMetadata({
    title: content.title,
    description: messages[locale].description,
    path: "/projects",
    locale,
  });
}

export default async function ProjectsPage({
  params,
}: ProjectsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) return null;

  const content = messages[locale];

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
        {getProjects(locale).eyebrow}
      </p>
      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
        {content.title}{" "}
        <span className="text-fg-secondary">{content.titleEmphasis}</span>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-8 text-fg-secondary sm:text-lg">
        {content.description}
      </p>
    </div>
  );
}
