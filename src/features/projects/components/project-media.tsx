import Image from "next/image";

import type { ProjectMedia as ProjectMediaData } from "../types/project";

interface ProjectMediaProps {
  media?: ProjectMediaData;
  priority?: boolean;
}

export function ProjectMedia({ media, priority = false }: ProjectMediaProps) {
  if (!media) {
    return (
      <div
        aria-hidden="true"
        className="relative min-h-64 overflow-hidden rounded-2xl border border-border bg-background sm:min-h-80"
      >
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(128,128,128,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.16em] text-fg-muted">
          Project media
        </div>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="relative aspect-video">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 960px, 100vw"
          className="object-cover"
        />
      </div>
      {media.caption ? (
        <figcaption className="border-t border-border px-5 py-3 text-sm text-fg-secondary">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
