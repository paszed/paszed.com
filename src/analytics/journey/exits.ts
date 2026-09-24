import type { JourneyPath } from "./path";

export interface DeadEnd {
  path: string;
  sessions: number;
  exits: number;
  exitRate: number;
}

export function detectDeadEnds(paths: JourneyPath[]): DeadEnd[] {
  const stats = new Map<string, { sessions: number; exits: number }>();

  for (const journey of paths) {
    const lastRoute = journey.routes.at(-1);
    if (!lastRoute) continue;

    const current = stats.get(lastRoute) ?? { sessions: 0, exits: 0 };
    current.sessions += 1;

    if (journey.exit === lastRoute) {
      current.exits += 1;
    }

    stats.set(lastRoute, current);
  }

  return [...stats.entries()]
    .filter(([, value]) => value.sessions >= 3)
    .map(([path, value]) => ({
      path,
      sessions: value.sessions,
      exits: value.exits,
      exitRate: value.exits / value.sessions,
    }))
    .sort((a, b) => b.exitRate - a.exitRate);
}
