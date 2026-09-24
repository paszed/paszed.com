export interface ProjectTechnology {
  name: string;
  purpose: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  category: string;
  status: string;
  started?: number;
  featured?: boolean;
  media?: readonly ProjectMedia[];
  overview: readonly string[];
  problem?: readonly string[];
  architecture?: readonly string[];
  capabilities?: readonly string[];
  engineering?: readonly string[];
  challenges?: readonly string[];
  lessons?: readonly string[];
  roadmap?: readonly string[];
  technologies: readonly ProjectTechnology[];
  links?: readonly ProjectLink[];
}

export interface ProjectLink { label: string; href: string; }

export type ProjectContent = Omit<Project, "slug">;
