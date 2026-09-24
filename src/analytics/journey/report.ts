import type { AnalyticsEvent } from "../events/types";
import { detectJourneyAnomalies } from "./anomalies";
import { detectDeadEnds } from "./exits";
import { buildJourneyGraph } from "./graph";
import { buildJourneyPath } from "./path";
import { groupEventsBySession } from "./session";

export function buildJourneyReport(events: AnalyticsEvent[]) {
  const sessions = groupEventsBySession(events);

  const paths = [...sessions.values()]
    .map(buildJourneyPath)
    .filter((path) => path !== null);

  return {
    sessionCount: sessions.size,
    journeyCount: paths.length,
    boundaries: {
      observedStartCount: paths.filter((path) => path.observedStart).length,
      observedExitCount: paths.filter((path) => path.observedExit).length,
    },
    graph: buildJourneyGraph(paths),
    deadEnds: detectDeadEnds(paths),
    anomalies: paths.flatMap((path) =>
      detectJourneyAnomalies(path).map((anomaly) => ({
        sessionId: path.sessionId,
        ...anomaly,
      })),
    ),
  };
}

export type JourneyReport = ReturnType<typeof buildJourneyReport>;
