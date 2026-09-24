"use client";

import Link from "next/link";
import { trackProjectOpen } from "@/analytics";
import type { Locale } from "@/i18n";
import { localizePath } from "@/i18n";
import { Card } from "@/ui";
import { TechnologyIcon } from "@/features/specs/components/technology";
import type { Project } from "../types/project";
import type { ProjectsContent } from "../types/projects";

interface ProjectListProps {
  projects: readonly Project[];
  locale: Locale;
  labels: ProjectsContent["labels"];
}

function ProjectCard({
  project,
  locale, labels,
}: {
  project: Project;
  locale: Locale;
  labels: ProjectsContent["labels"];
}) {
  return (
    <Card className="group h-full bg-surface">
      <Link
        href={localizePath(`/projects/${project.slug}`, locale)}
        className="flex h-full flex-col"
        onClick={() => trackProjectOpen(project.slug)}
      >
        <div className="relative flex min-h-52 items-end overflow-hidden border-b border-border bg-background p-6 sm:min-h-60">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(128,128,128,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative flex w-full items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">{project.category}</span>
            {project.featured ? (
              <span className="rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-secondary">
                {labels.featured}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div>
            <h2 className="text-3xl font-medium tracking-[-0.035em] transition-colors group-hover:text-fg-secondary">{project.title}</h2>
            <p className="mt-3 text-base font-medium leading-7">{project.tagline}</p>
            <p className="mt-3 text-sm leading-7 text-fg-secondary">{project.summary}</p>
          </div>

          {project.technologies.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map((technology) => (
                <span key={technology.name} className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 font-mono text-[11px] text-fg-secondary">
                  <TechnologyIcon name={technology.name} className="size-3.5" />
                  {technology.name}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
            <span className="font-mono text-xs text-fg-muted">{project.status}</span>
            <span className="text-sm text-fg-muted transition-transform duration-200 group-hover:translate-x-1">{labels.viewProject} ↗</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function ProjectList({ projects, locale, labels }: ProjectListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          locale={locale}
          labels={labels}
        />
      ))}
    </div>
  );
}
