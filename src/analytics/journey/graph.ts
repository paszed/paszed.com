import type { JourneyPath } from "./path";
import { buildTransitions } from "./transitions";

export interface JourneyGraph {
  nodes: string[];
  transitions: ReturnType<typeof buildTransitions>;
}

export function buildJourneyGraph(paths: JourneyPath[]): JourneyGraph {
  const nodes = new Set<string>();

  for (const journey of paths) {
    for (const route of journey.routes) {
      nodes.add(route);
    }
  }

  return {
    nodes: [...nodes],
    transitions: buildTransitions(paths),
  };
}
