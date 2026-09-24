import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { readAnalyticsReportMock } = vi.hoisted(() => ({
  readAnalyticsReportMock: vi.fn(),
}));

vi.mock("@/analytics/report/server", () => ({
  readAnalyticsReport: readAnalyticsReportMock,
}));

import { GET } from "./route";

const token = "test-argus-analytics-secret";
const from = "2026-09-24T10:00:00.000Z";
const to = "2026-09-24T11:00:00.000Z";

function request(
  options: {
    authorization?: string;
    from?: string | null;
    to?: string | null;
  } = {},
): Request {
  const url = new URL("https://paszed.com/api/argus/analytics");
  if (options.from !== null) url.searchParams.set("from", options.from ?? from);
  if (options.to !== null) url.searchParams.set("to", options.to ?? to);

  return new Request(url, {
    headers: options.authorization
      ? { authorization: options.authorization }
      : {},
  });
}

describe("GET /api/argus/analytics", () => {
  const previousToken = process.env.ARGUS_ANALYTICS_TOKEN;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ARGUS_ANALYTICS_TOKEN = token;
  });

  afterEach(() => {
    if (previousToken === undefined) {
      delete process.env.ARGUS_ANALYTICS_TOKEN;
    } else {
      process.env.ARGUS_ANALYTICS_TOKEN = previousToken;
    }
  });

  it("rejects requests without a bearer token", async () => {
    const response = await GET(request());
    expect(response.status).toBe(401);
    expect(readAnalyticsReportMock).not.toHaveBeenCalled();
  });

  it("rejects an incorrect bearer token", async () => {
    const response = await GET(request({ authorization: "Bearer incorrect" }));
    expect(response.status).toBe(401);
    expect(readAnalyticsReportMock).not.toHaveBeenCalled();
  });

  it("rejects requests when the server token is missing", async () => {
    delete process.env.ARGUS_ANALYTICS_TOKEN;
    const response = await GET(request({ authorization: `Bearer ${token}` }));
    expect(response.status).toBe(401);
    expect(readAnalyticsReportMock).not.toHaveBeenCalled();
  });

  it("requires both time-window parameters", async () => {
    const response = await GET(request({
      authorization: `Bearer ${token}`,
      from: null,
    }));
    expect(response.status).toBe(400);
    expect(readAnalyticsReportMock).not.toHaveBeenCalled();
  });

  it("rejects windows longer than 24 hours", async () => {
    const response = await GET(request({
      authorization: `Bearer ${token}`,
      from: "2026-09-22T10:00:00.000Z",
    }));
    expect(response.status).toBe(400);
    expect(readAnalyticsReportMock).not.toHaveBeenCalled();
  });

  it("returns a report without allowing caching", async () => {
    const report = {
      from,
      to,
      truncated: false,
      traffic: { eventCount: 3 },
    };
    readAnalyticsReportMock.mockResolvedValue(report);

    const response = await GET(request({ authorization: `Bearer ${token}` }));

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual(report);
    expect(readAnalyticsReportMock).toHaveBeenCalledExactlyOnceWith(
      new Date(from),
      new Date(to),
    );
  });

  it("does not expose repository errors in its response", async () => {
    readAnalyticsReportMock.mockRejectedValue(new Error("private database details"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const response = await GET(request({ authorization: `Bearer ${token}` }));
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "report_unavailable" });
      expect(readAnalyticsReportMock).toHaveBeenCalledOnce();
    } finally {
      consoleSpy.mockRestore();
    }
  });
});
