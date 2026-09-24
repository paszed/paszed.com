import { afterEach, describe, expect, it, vi } from "vitest";
import { trackServer } from "../../../../src/analytics/core/server";
import { supabase } from "../../../../src/lib/supabase/server";

vi.mock("../../../../src/lib/supabase/server", () => ({
  supabase: { from: vi.fn() },
}));

const input = {
  type: "page_view" as const,
  path: "/about",
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("trackServer", () => {
  it("inserts an event with defaults when optional fields are absent", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({ insert } as unknown as ReturnType<typeof supabase.from>);

    await trackServer(input);

    expect(supabase.from).toHaveBeenCalledWith("analytics_events");
    expect(insert).toHaveBeenCalledWith({
      id: expect.any(String),
      session_id: expect.any(String),
      source: "server",
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
      occurred_at: expect.any(String),
      created_at: expect.any(String),
    });
  });

  it("inserts provided optional fields and normalizes the referrer", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({ insert } as unknown as ReturnType<typeof supabase.from>);

    await trackServer({
      ...input,
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

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      previous_path: "/",
      locale: "hu",
      referrer: "example.com",
      viewport_width: 1440,
      viewport_height: 900,
      user_agent: "TestAgent",
      traffic_class: "human",
      metadata: { campaign: "test" },
    }));
  });

  it("logs a database error without throwing", async () => {
    const failure = { message: "database unavailable" };
    const insert = vi.fn().mockResolvedValue({ error: failure });
    vi.mocked(supabase.from).mockReturnValue({ insert } as unknown as ReturnType<typeof supabase.from>);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(trackServer(input)).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledWith("[analytics:server]", failure);
  });
});
