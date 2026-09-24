import "server-only";

import { buildJourneyReport } from "./report";
import { readJourneyEvents } from "./repository";

export async function readJourneyReport(from: Date, to: Date) {
  const { events, truncated } = await readJourneyEvents(from, to);

  return { ...buildJourneyReport(events), truncated };
}
