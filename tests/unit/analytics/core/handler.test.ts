import { afterEach, describe, expect, it, vi } from "vitest";
import { handleAnalyticsPost } from "../../../../src/analytics/core/handler";
import { readAnalyticsBody } from "../../../../src/analytics/core/request";
import { supabase } from "../../../../src/lib/supabase/server";

vi.mock("../../../../src/analytics/core/request", () => ({
  readAnalyticsBody: vi.fn(),
}));
vi.mock("../../../../src/lib/supabase/server", () => ({
  supabase: { rpc: vi.fn() },
}));

const validEvent = () => ({
  id: "123e4567-e89b-42d3-a456-426614174000",
  sessionId: "123e4567-e89b-42d3-a456-426614174001",
  type: "page_view",
  path: "/about",
  timestamp: "2026-09-22T12:00:00.000Z",
});

const request = {} as Request;

async function expectInvalidEvent(event: unknown) {
  vi.mocked(readAnalyticsBody).mockResolvedValueOnce(event);
  const response = await handleAnalyticsPost(request);
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ ok: false, error: "invalid_event" });
  expect(supabase.rpc).not.toHaveBeenCalled();
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("handleAnalyticsPost: request validation", () => {
  it("rejects an oversized body with HTTP 413", async () => {
    vi.mocked(readAnalyticsBody).mockRejectedValueOnce(new RangeError("too large"));
    const response = await handleAnalyticsPost(request);
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ ok: false, error: "payload_too_large" });
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with HTTP 400", async () => {
    vi.mocked(readAnalyticsBody).mockRejectedValueOnce(new SyntaxError("invalid JSON"));
    const response = await handleAnalyticsPost(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: "invalid_json" });
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it.each([null, undefined, false, 42, "event", [], {}])(
    "rejects a non-event payload: %s",
    async (event) => {
      await expectInvalidEvent(event);
    },
  );

  it.each([
    { id: "invalid" },
    { sessionId: "invalid" },
    { type: "unknown_event" },
    { path: "about" },
    { path: "" },
    { path: "/" + "a".repeat(2048) },
    { previousPath: "about" },
    { timestamp: "not-a-date" },
    { context: null },
    { context: [] },
    { context: "invalid" },
    { context: { locale: "x".repeat(17) } },
  ])("rejects invalid event fields: %j", async (changes) => {
    await expectInvalidEvent({ ...validEvent(), ...changes });
  });

  it("rejects missing required event fields", async () => {
    for (const field of ["id", "sessionId", "type", "path", "timestamp"]) {
      const event: Record<string, unknown> = validEvent();
      delete event[field];
      await expectInvalidEvent(event);
    }
  });
});

describe("handleAnalyticsPost: ingestion", () => {
  it("ingests a valid event with default optional fields", async () => {
    vi.mocked(readAnalyticsBody).mockResolvedValueOnce(validEvent());
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: true, error: null } as never);

    const response = await handleAnalyticsPost(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(supabase.rpc).toHaveBeenCalledWith("ingest_analytics_event", {
      p_event: {
        id: validEvent().id,
        session_id: validEvent().sessionId,
        source: "browser",
        type: "page_view",
        path: "/about",
        previous_path: null,
        locale: null,
        referrer: null,
        viewport_width: null,
        viewport_height: null,
        user_agent: null,
        traffic_class: null,
        metadata: null,
        occurred_at: validEvent().timestamp,
        created_at: expect.any(String),
      },
    });
  });

  it("maps optional fields and normalizes the referrer", async () => {
    vi.mocked(readAnalyticsBody).mockResolvedValueOnce({
      ...validEvent(),
      previousPath: "/",
      context: {
        locale: "hu",
        referrer: "EXAMPLE.COM",
        viewport: { width: 1440, height: 900 },
        userAgent: "TestAgent",
        trafficClass: "human",
        metadata: { campaign: "test" },
      },
    });
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: true, error: null } as never);

    const response = await handleAnalyticsPost(request);

    expect(response.status).toBe(200);
    expect(supabase.rpc).toHaveBeenCalledWith(
      "ingest_analytics_event",
      { p_event: expect.objectContaining({
        previous_path: "/",
        locale: "hu",
        referrer: "example.com",
        viewport_width: 1440,
        viewport_height: 900,
        user_agent: "TestAgent",
        traffic_class: "human",
        metadata: { campaign: "test" },
      }) },
    );
  });

  it("returns HTTP 500 and logs a database error", async () => {
    const failure = { message: "database unavailable" };
    vi.mocked(readAnalyticsBody).mockResolvedValueOnce(validEvent());
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: null, error: failure } as never);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await handleAnalyticsPost(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false });
    expect(error).toHaveBeenCalledWith("[analytics]", failure);
  });

  it("returns HTTP 429 with a retry header when ingestion is rejected", async () => {
    vi.mocked(readAnalyticsBody).mockResolvedValueOnce(validEvent());
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ data: false, error: null } as never);

    const response = await handleAnalyticsPost(request);

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(await response.json()).toEqual({ ok: false, error: "rate_limited" });
  });
});
