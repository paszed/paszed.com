"use client";

import type { Project } from "../types/project";
import type { ProjectsContent } from "../types/projects";
import { useDiscovery } from "@/analytics";
import { TechnologyIcon } from "@/features/specs/components/technology";
import { Eyebrow } from "@/ui/typography";
import { ProjectMedia } from "./project-media";

interface ProjectDetailProps {
  project: Project;
  labels: ProjectsContent["labels"];
}

function ContentSection({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.6fr_1.4fr] lg:gap-12 lg:px-8 lg:py-24">
        <Eyebrow>{title}</Eyebrow>
        <div className="max-w-3xl space-y-5 text-lg leading-8 text-fg-secondary">
          {items.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardSection({
  title,
  items,
  discovery,
}: {
  title: string;
  items: readonly string[];
  discovery?: string;
}) {
  const discoveryRef = useDiscovery({
    type: "capability_discovery",
    target: discovery ?? "",
  });

  return (
    <section ref={discoveryRef} className="border-b border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.6fr_1.4fr] lg:gap-12 lg:px-8 lg:py-24">
        <Eyebrow>{title}</Eyebrow>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-fg-muted"
            >
              <p className="mt-4 text-sm leading-7">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectDetail({ project, labels }: ProjectDetailProps) {
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Eyebrow>{project.category}</Eyebrow>
          <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.055em] sm:text-6xl lg:text-8xl lg:leading-[0.95]">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 tracking-tight sm:text-2xl">
            {project.tagline}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-fg-secondary">
            {project.summary}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-fg-secondary">
            <span className="rounded-full border border-border px-3 py-1.5">{project.status}</span>
            {project.started ? (
              <span className="rounded-full border border-border px-3 py-1.5">
                {labels.started} {project.started}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      {project.media?.[0] ? (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
            <ProjectMedia media={project.media[0]} priority />
          </div>
        </section>
      ) : null}

      <ContentSection title={labels.overview} items={project.overview} />

      {project.problem ? <CardSection title={labels.problem} items={project.problem} /> : null}

      {project.architecture ? (
        <ContentSection title={labels.architecture} items={project.architecture} />
      ) : null}

      {project.capabilities ? (
        <CardSection title={labels.capabilities} items={project.capabilities} discovery="project-capabilities" />
      ) : null}

      {project.engineering ? (
        <CardSection title={labels.engineering} items={project.engineering} />
      ) : null}

      {project.challenges ? (
        <CardSection title={labels.challenges} items={project.challenges} />
      ) : null}

      {project.lessons ? (
        <CardSection title={labels.lessons} items={project.lessons} />
      ) : null}

      {project.roadmap ? <CardSection title={labels.roadmap} items={project.roadmap} /> : null}

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.6fr_1.4fr] lg:gap-12 lg:px-8 lg:py-24">
          <Eyebrow>{labels.technology}</Eyebrow>
          <div className="grid gap-3 sm:grid-cols-2">
            {project.technologies.map((technology) => (
              <div
                key={technology.name}
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-fg-muted"
              >
                <div className="flex items-center gap-3">
                  <TechnologyIcon
                    name={technology.name}
                    className="size-5"
                  />
                  <span className="font-medium">{technology.name}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-fg-secondary">
                  {technology.purpose}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </article>
  );
}
