import { track } from "../core/client";

type InteractionMetadata = Record<string, unknown>;

type InteractionType =
  | "click"
  | "project_open"
  | "project_expand"
  | "github_click"
  | "download"
  | "copy"
  | "form_interaction";

export function trackInteraction({
  type,
  target,
  metadata,
}: {
  type: InteractionType;
  target?: string;
  metadata?: InteractionMetadata;
}): void {
  void track({
    type,
    path: window.location.pathname,
    context: {
      metadata: {
        ...(target ? { target } : {}),
        ...metadata,
      },
    },
  });
}

export function trackProjectOpen(slug: string): void {
  trackInteraction({ type: "project_open", target: slug });
}

export function trackProjectExpand(target: string): void {
  trackInteraction({ type: "project_expand", target });
}

export function trackGithubClick(repository: string): void {
  trackInteraction({ type: "github_click", target: repository });
}

export function trackDownload(target: string): void {
  trackInteraction({ type: "download", target });
}

export function trackCopy(target: string): void {
  trackInteraction({ type: "copy", target });
}

export function trackFormInteraction(target: string, metadata?: InteractionMetadata): void {
  trackInteraction({ type: "form_interaction", target, metadata });
}
