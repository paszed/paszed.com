import { describe, expect, it } from "vitest";
import { MAX_ANALYTICS_BODY_BYTES, readAnalyticsBody } from "../../../../src/analytics/core/request";

const encoder = new TextEncoder();

function requestWithChunks(chunks: Uint8Array[]): Request {
  let index = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index === chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(chunks[index++]);
    },
  });
  return new Request("https://example.com/api/analytics", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit);
}

describe("readAnalyticsBody", () => {
  it("rejects a missing body", async () => {
    await expect(readAnalyticsBody(new Request("https://example.com")))
      .rejects.toThrow("missing_body");
  });

  it("parses JSON split across chunks", async () => {
    const json = JSON.stringify({ type: "page_view" });
    const midpoint = Math.floor(json.length / 2);
    const request = requestWithChunks([
      encoder.encode(json.slice(0, midpoint)),
      encoder.encode(json.slice(midpoint)),
    ]);
    await expect(readAnalyticsBody(request)).resolves.toEqual({ type: "page_view" });
  });

  it("accepts a body exactly at the byte limit", async () => {
    const overhead = JSON.stringify({ value: "" }).length;
    const value = "a".repeat(MAX_ANALYTICS_BODY_BYTES - overhead);
    const body = encoder.encode(JSON.stringify({ value }));
    expect(body.byteLength).toBe(MAX_ANALYTICS_BODY_BYTES);
    await expect(readAnalyticsBody(requestWithChunks([body])))
      .resolves.toEqual({ value });
  });

  it("rejects a body exceeding the byte limit", async () => {
    const request = requestWithChunks([
      encoder.encode(" ".repeat(MAX_ANALYTICS_BODY_BYTES)),
      encoder.encode(" "),
    ]);
    await expect(readAnalyticsBody(request))
      .rejects.toThrow("analytics_body_too_large");
  });

  it("rejects malformed JSON", async () => {
    const request = requestWithChunks([encoder.encode("{invalid")]);
    await expect(readAnalyticsBody(request)).rejects.toThrow(SyntaxError);
  });

  it("rejects invalid UTF-8", async () => {
    const request = requestWithChunks([new Uint8Array([255])]);
    await expect(readAnalyticsBody(request)).rejects.toThrow(TypeError);
  });
});
