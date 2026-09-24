import { afterEach, describe, expect, it, vi } from "vitest";
import { createEventPayload, sendEventBeacon } from "../../../../src/analytics/core/transport";
import { getBrowserContext } from "../../../../src/analytics/context/browser";
import { getSessionId } from "../../../../src/analytics/session";

vi.mock("../../../../src/analytics/context/browser", () => ({
  getBrowserContext: vi.fn(() => ({ locale: "en", trafficClass: "human" })),
}));
vi.mock("../../../../src/analytics/session", () => ({
  getSessionId: vi.fn(() => "session-1"),
}));

const input = {
  type: "page_view",
  path: "/",
} as Parameters<typeof createEventPayload>[0];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("createEventPayload", () => {
  it("adds event identity, session, timestamp, and browser context", () => {
    const payload = createEventPayload(input);

    expect(payload).toEqual({
      id: expect.any(String),
      sessionId: "session-1",
      source: "browser",
      timestamp: expect.any(String),
      type: "page_view",
      path: "/",
      context: { locale: "en", trafficClass: "human" },
    });
    expect(Number.isNaN(Date.parse(payload.timestamp))).toBe(false);
    expect(getSessionId).toHaveBeenCalledOnce();
    expect(getBrowserContext).toHaveBeenCalledOnce();
  });

  it("lets event context override browser context", () => {
    const event = {
      ...input,
      context: { locale: "hu" },
    } as Parameters<typeof createEventPayload>[0];

    expect(createEventPayload(event).context).toEqual({
      locale: "hu",
      trafficClass: "human",
    });
  });
});

describe("sendEventBeacon", () => {
  it("returns false when window is unavailable", () => {
    vi.stubGlobal("window", undefined);
    expect(sendEventBeacon(input)).toBe(false);
    expect(getSessionId).not.toHaveBeenCalled();
  });

  it("returns false when sendBeacon is unavailable", () => {
    vi.stubGlobal("navigator", {});
    expect(sendEventBeacon(input)).toBe(false);
    expect(getSessionId).not.toHaveBeenCalled();
  });

  it("sends a JSON blob and returns the beacon result", async () => {
    const sendBeacon = vi.fn().mockReturnValue(true);
    vi.stubGlobal("navigator", { sendBeacon });

    expect(sendEventBeacon(input)).toBe(true);
    expect(sendBeacon).toHaveBeenCalledOnce();

    const [url, blob] = sendBeacon.mock.calls[0] as [string, Blob];
    expect(url).toBe("/api/analytics");
    expect(blob.type).toBe("application/json");
    expect(JSON.parse(await blob.text())).toMatchObject({
      sessionId: "session-1",
      source: "browser",
      type: "page_view",
      path: "/",
    });
  });

  it("propagates a false beacon result", () => {
    vi.stubGlobal("navigator", { sendBeacon: vi.fn().mockReturnValue(false) });
    expect(sendEventBeacon(input)).toBe(false);
  });
});
