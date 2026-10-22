"use client";

import Link from "next/link";
import Image from "next/image";
import { trackProjectOpen } from "@/analytics";
import type { Locale } from "@/i18n";
import { localizePath } from "@/i18n";
import type { Project } from "../types/project";
import type { ProjectsContent } from "../types/projects";

interface ProjectListProps {
  projects: readonly Project[];
  locale: Locale;
  labels: ProjectsContent["labels"];
}

function ProjectCard({ project, locale, labels, isPriority }: {
  project: Project;
  locale: Locale;
  labels: ProjectsContent["labels"];
  isPriority: boolean;
}) {
  const isOxheaded = project.slug === "oxheaded";
  const is1BuckSoft = project.slug === "1bucksoft";
  const isHuman50 = project.slug === "human50";
  const isNotafund = project.slug === "notafund";

  return (
    <Link
      href={project.website ?? localizePath(`/projects/${project.slug}`, locale)}
      onClick={() => trackProjectOpen(project.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-200 hover:border-fg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fg"
    >
      <div
        className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border ${isHuman50 ? "bg-[#F7F5EF]" : isOxheaded ? "bg-[#121111]" : is1BuckSoft ? "bg-[#101010]" : isNotafund ? "bg-[#141615]" : "bg-[radial-gradient(ellipse_at_center,rgba(223,255,0,0.13)_0%,#102A2A_30%,#0D1C2C_60%,#071321_100%)]"}`}
      >
        {project.artwork ? (
          <Image
            src={project.artwork}
            alt={`${project.title} brand artwork`}
            width={660}
            height={372}
            priority={isPriority}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-contain transition-transform duration-500 group-hover:scale-[1.035] ${isHuman50 ? "h-[76%] w-auto" : isOxheaded || is1BuckSoft ? "h-[78%] w-auto" : isNotafund ? "h-auto w-[84%]" : "h-[65%] w-auto"}`}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-[-0.04em]">{project.title}</h2>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-fg-muted transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
        </div>
        <p className="mt-3 text-sm leading-7 text-fg-secondary">{project.summary}</p>
        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono text-xs text-fg-muted">{project.status}</span>
            <span className="text-xs text-fg-secondary">{labels.viewProject}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProjectList({ projects, locale, labels }: ProjectListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} locale={locale} labels={labels} isPriority={index < 2} />
      ))}
    </div>
  );
}
