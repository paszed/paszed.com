import type { Locale } from "@/i18n/config";
import type { ProjectsContent } from "@/features/projects/types/projects";
import { projects as projectConfig } from "@/config/projects";

import { deProjects } from "./de";
import { enProjects } from "./en";
import { huProjects } from "./hu";

export const projectsContent: Record<Locale, ProjectsContent> = {
  en: enProjects,
  de: deProjects,
  hu: huProjects,
};

export function getProjects(locale: Locale) {
  const content = projectsContent[locale];
  return {
    ...content,
    projects: content.projects.map((project, index) => ({
      ...project,
      ...Object.values(projectConfig)[index],
    })),
  };
}

export { deProjects, enProjects, huProjects };
