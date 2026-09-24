import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { readJourneyEventsMock } = vi.hoisted(() => ({
  readJourneyEventsMock: vi.fn(),
}));

vi.mock("./repository", () => ({
  readJourneyEvents: readJourneyEventsMock,
}));

import { readJourneyReport } from "./server";

const from = new Date("2026-09-24T00:00:00.000Z");
const to = new Date("2026-09-25T00:00:00.000Z");

describe("readJourneyReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([false, true])(
    "propagates truncated=%s from the repository",
    async (truncated) => {
      readJourneyEventsMock.mockResolvedValue({ events: [], truncated });

      await expect(readJourneyReport(from, to)).resolves.toEqual({
        sessionCount: 0,
        journeyCount: 0,
        boundaries: { observedStartCount: 0, observedExitCount: 0 },
        graph: { nodes: [], transitions: [] },
        deadEnds: [],
        anomalies: [],
        truncated,
      });

      expect(readJourneyEventsMock).toHaveBeenCalledWith(from, to);
    },
  );

  it("propagates repository failures", async () => {
    readJourneyEventsMock.mockRejectedValue(new Error("Database unavailable"));

    await expect(readJourneyReport(from, to)).rejects.toThrow(
      "Database unavailable",
    );
  });
});

