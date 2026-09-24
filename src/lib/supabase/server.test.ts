import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn() }));

describe("server Supabase client", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("creates the client with the configured URL and service-role key", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
    const { createClient } = await import("@supabase/supabase-js");
    const client = { source: "test" };
    vi.mocked(createClient).mockReturnValue(client as unknown as ReturnType<typeof createClient>);

    const { supabase } = await import("./server");
    expect(createClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "service-role-key",
    );
    expect(supabase).toBe(client);
  });

  it.each([
    ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    ["SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_SUPABASE_URL"],
  ])("rejects a missing %s", async (missing, present) => {
    vi.stubEnv(missing, "");
    vi.stubEnv(present, "configured");
    await expect(import("./server")).rejects.toThrow(
      "Missing Supabase environment variables",
    );
  });
});
