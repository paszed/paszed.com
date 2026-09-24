import type { JourneyPath } from "./path";

export interface JourneyTransition {
  from: string;
  to: string;
  count: number;
}

export function buildTransitions(paths: JourneyPath[]): JourneyTransition[] {
  const counts = new Map<string, number>();

  for (const journey of paths) {
    for (let index = 1; index < journey.routes.length; index += 1) {
      const from = journey.routes[index - 1];
      const to = journey.routes[index];
      const key = `${from}\u0000${to}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts.entries()].map(([key, count]) => {
    const [from, to] = key.split("\u0000");
    return { from, to, count };
  });
}
