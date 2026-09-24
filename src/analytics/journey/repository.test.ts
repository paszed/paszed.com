import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  supabase: { from: fromMock },
}));

import { readJourneyEvents } from "./repository";

interface MockRow {
  id: string;
  session_id: string;
  source: "browser" | "server";
  type: "page_view";
  path: string;
  previous_path: string | null;
  occurred_at: string;
  metadata?: Record<string, unknown> | null;
}

function row(index: number): MockRow {
  return {
    id: `event-${index}`,
    session_id: "session-1",
    source: "browser",
    type: "page_view",
    path: `/page-${index}`,
    previous_path: index === 0 ? null : "/previous",
    occurred_at: "2026-09-24T12:00:00.000Z",
  };
}

function mockQuery(
  results: Array<{ data: MockRow[] | null; error: Error | null }>,
) {
  const range = vi.fn();

  for (const result of results) {
    range.mockResolvedValueOnce(result);
  }

  const query = {
    select: vi.fn(),
    gte: vi.fn(),
    lt: vi.fn(),
    order: vi.fn(),
    range,
  };

  query.select.mockReturnValue(query);
  query.gte.mockReturnValue(query);
  query.lt.mockReturnValue(query);
  query.order.mockReturnValue(query);

  fromMock.mockReturnValue(query);

  return query;
}

const from = new Date("2026-09-24T00:00:00.000Z");
const to = new Date("2026-09-25T00:00:00.000Z");

describe("readJourneyEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps database rows into analytics events", async () => {
    const query = mockQuery([
      { data: [row(0), row(1)], error: null },
    ]);

    await expect(readJourneyEvents(from, to)).resolves.toEqual({
      truncated: false,
      events: [
      {
        id: "event-0",
        sessionId: "session-1",
        source: "browser",
        type: "page_view",
        path: "/page-0",
        timestamp: "2026-09-24T12:00:00.000Z",
      },
      {
        id: "event-1",
        sessionId: "session-1",
        source: "browser",
        type: "page_view",
        path: "/page-1",
        previousPath: "/previous",
        timestamp: "2026-09-24T12:00:00.000Z",
      },
      ],
    });

    expect(fromMock).toHaveBeenCalledWith("analytics_events");
    expect(query.gte).toHaveBeenCalledWith(
      "occurred_at",
      from.toISOString(),
    );
    expect(query.lt).toHaveBeenCalledWith(
      "occurred_at",
      to.toISOString(),
    );
    expect(query.range).toHaveBeenCalledWith(0, 999);
  });

  it("reads subsequent pages when the first page is full", async () => {
    const query = mockQuery([
      {
        data: Array.from({ length: 1_000 }, (_, index) => row(index)),
        error: null,
      },
      { data: [row(1_000)], error: null },
    ]);

    const result = await readJourneyEvents(from, to);

    expect(result.events).toHaveLength(1_001);
    expect(result.truncated).toBe(false);
    expect(query.range).toHaveBeenNthCalledWith(1, 0, 999);
    expect(query.range).toHaveBeenNthCalledWith(2, 1_000, 1_999);
  });

  it("rejects invalid time windows without querying the database", async () => {
    await expect(readJourneyEvents(to, from)).rejects.toThrow(RangeError);
    await expect(readJourneyEvents(from, from)).rejects.toThrow(RangeError);
    await expect(
      readJourneyEvents(new Date("invalid"), to),
    ).rejects.toThrow(RangeError);

    expect(fromMock).not.toHaveBeenCalled();
  });

  it("propagates database failures", async () => {
    mockQuery([
      { data: null, error: new Error("Database unavailable") },
    ]);

    await expect(readJourneyEvents(from, to)).rejects.toThrow(
      "Failed to read analytics events",
    );
  });

  it("returns an empty array when no events match", async () => {
    mockQuery([{ data: [], error: null }]);

    await expect(readJourneyEvents(from, to)).resolves.toEqual({ events: [], truncated: false });
  });
});

describe("readJourneyEvents boundary", () => {
  it("reports exactly 10,000 events as complete", async () => {
    const query = mockQuery(Array.from({ length: 10 }, (_, page) => ({
      data: Array.from({ length: 1_000 }, (_, index) => row(page * 1_000 + index)),
      error: null,
    })).concat([{ data: [], error: null }]));

    const result = await readJourneyEvents(from, to);

    expect(result.events).toHaveLength(10_000);
    expect(result.truncated).toBe(false);
    expect(query.range).toHaveBeenCalledTimes(11);
    expect(query.range).toHaveBeenLastCalledWith(10_000, 10_000);
  });

  it("reports 10,001 events as truncated without returning the extra event", async () => {
    const query = mockQuery(Array.from({ length: 10 }, (_, page) => ({
      data: Array.from({ length: 1_000 }, (_, index) => row(page * 1_000 + index)),
      error: null,
    })).concat([{ data: [row(10_000)], error: null }]));

    const result = await readJourneyEvents(from, to);

    expect(result.events).toHaveLength(10_000);
    expect(result.events.at(-1)?.id).toBe("event-9999");
    expect(result.truncated).toBe(true);
    expect(query.range).toHaveBeenCalledTimes(11);
    expect(query.range).toHaveBeenLastCalledWith(10_000, 10_000);
  });

  it("propagates a database failure during the lookahead query", async () => {
    mockQuery([
      ...Array.from({ length: 10 }, (_, page) => ({
        data: Array.from({ length: 1_000 }, (_, index) => row(page * 1_000 + index)),
        error: null,
      })),
      { data: null, error: new Error("Lookahead failed") },
    ]);

    await expect(readJourneyEvents(from, to)).rejects.toThrow(
      "Failed to read analytics events",
    );
  });
});

describe("readJourneyEvents optional database fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("treats a null database result as an empty page", async () => {
    mockQuery([{ data: null, error: null }]);

    await expect(readJourneyEvents(from, to)).resolves.toEqual({
      events: [],
      truncated: false,
    });
  });

  it("maps present metadata into event context", async () => {
    mockQuery([{
      data: [{ ...row(0), metadata: { activeMs: 1500, depth: 50 } }],
      error: null,
    }]);

    await expect(readJourneyEvents(from, to)).resolves.toEqual({
      events: [{
        id: "event-0",
        sessionId: "session-1",
        source: "browser",
        type: "page_view",
        path: "/page-0",
        timestamp: "2026-09-24T12:00:00.000Z",
        context: { metadata: { activeMs: 1500, depth: 50 } },
      }],
      truncated: false,
    });
  });
});
