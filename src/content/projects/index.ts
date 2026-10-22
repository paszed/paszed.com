import type { Locale } from "@/i18n/config";
import type { ProjectsContent } from "@/features/projects/types/projects";
import { projects as projectConfig } from "@/config/projects";

import { deProjects } from "./de";
import { enProjects } from "./en";
import { huProjects } from "./hu";

const projectsContent: Record<Locale, ProjectsContent> = {
  en: enProjects,
  de: deProjects,
  hu: huProjects,
};

export function getProjects(locale: Locale) {
  const content = projectsContent[locale];
  return {
    ...content,
    projects: content.projects
      .filter((project) => ["feedchamps", "human50", "notafund", "1bucksoft", "oxheaded"].includes(project.slug))
      .map((project) => {
        const config = projectConfig[project.slug as keyof typeof projectConfig];
        if (!config) throw new Error(`Missing project configuration: ${project.slug}`);
        return { ...project, ...config };
      }),
  };
}

