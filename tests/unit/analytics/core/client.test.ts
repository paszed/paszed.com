import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "../../../../src/analytics/core/client";
import { createEventPayload } from "../../../../src/analytics/core/transport";

vi.mock("../../../../src/analytics/core/transport", () => ({
  createEventPayload: vi.fn(() => ({ id: "event-1" })),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("track", () => {
  const input = { type: "page_view", path: "/" } as Parameters<typeof track>[0];

  it("posts the event payload with keepalive enabled", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    await track(input);

    expect(createEventPayload).toHaveBeenCalledWith(input);
    expect(fetchMock).toHaveBeenCalledWith("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "event-1" }),
      keepalive: true,
    });
  });

  it("logs an unsuccessful HTTP response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await track(input);

    expect(error).toHaveBeenCalledWith("[analytics:delivery]", 503);
  });

  it("logs a network error without throwing", async () => {
    const failure = new Error("network unavailable");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(failure));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(track(input)).resolves.toBeUndefined();

    expect(error).toHaveBeenCalledWith("[analytics:delivery]", failure);
  });

  it("does not send events when window is unavailable", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("window", undefined);

    await track(input);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(createEventPayload).not.toHaveBeenCalled();
  });
});
