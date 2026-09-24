import type { ProjectContent } from "./project";

export interface ProjectsContent {
  eyebrow: string;
  title: string;
  description: string;

  labels: {
    featured: string;
    viewProject: string;
    started: string;
    overview: string;
    problem: string;
    architecture: string;
    capabilities: string;
    engineering: string;
    challenges: string;
    lessons: string;
    roadmap: string;
    technology: string;
    links: string;
  };

  projects: readonly ProjectContent[];
}

