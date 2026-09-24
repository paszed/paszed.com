import { describe, expect, it } from "vitest";
import { normalizeReferrer } from "../../../../src/analytics/core/referrer";
import { isValidAnalyticsContext } from "../../../../src/analytics/core/validation";

describe("normalizeReferrer", () => {
  it.each([undefined, "", "a".repeat(254), "bad_host", ".example.com", "example.com.", "example..com"])("rejects invalid input", (value) => {
    expect(normalizeReferrer(value)).toBeNull();
  });
  it.each(["EXAMPLE.COM", "sub.example.com", "a".repeat(253)])("normalizes valid hostnames", (value) => {
    expect(normalizeReferrer(value)).toBe(value.toLowerCase());
  });
});

describe("isValidAnalyticsContext", () => {
  it("accepts missing and empty contexts", () => {
    expect(isValidAnalyticsContext(undefined)).toBe(true);
    expect(isValidAnalyticsContext({})).toBe(true);
  });
  it.each([null, false, 1, "text", []])("rejects a non-object context", (value) => {
    expect(isValidAnalyticsContext(value)).toBe(false);
  });
  it("accepts valid optional fields and boundary values", () => {
    expect(isValidAnalyticsContext({
      locale: "a".repeat(16),
      referrer: "a".repeat(2048),
      userAgent: "a".repeat(1024),
      trafficClass: "human",
      viewport: { width: 0, height: 100000 },
      metadata: { source: "test" },
    })).toBe(true);
  });
  it.each(["human", "crawler", "bot", "preview", "unknown"])("accepts traffic class %s", (trafficClass) => {
    expect(isValidAnalyticsContext({ trafficClass })).toBe(true);
  });
  it.each([
    { locale: 12 }, { locale: "a".repeat(17) },
    { referrer: null }, { referrer: "a".repeat(2049) },
    { userAgent: false }, { userAgent: "a".repeat(1025) },
    { trafficClass: 1 }, { trafficClass: "other" },
  ])("rejects an invalid optional field", (context) => {
    expect(isValidAnalyticsContext(context)).toBe(false);
  });
  it.each([
    null, [], "text", { width: 1 }, { width: 1, height: 1.5 },
    { width: -1, height: 1 }, { width: 1, height: -1 },
    { width: 100001, height: 1 }, { width: 1, height: 100001 },
  ])("rejects an invalid viewport", (viewport) => {
    expect(isValidAnalyticsContext({ viewport })).toBe(false);
  });
  it("accepts the largest permitted viewport dimensions", () => {
    expect(isValidAnalyticsContext({ viewport: { width: 100000, height: 100000 } })).toBe(true);
  });
  it.each([null, [], "text", { value: "a".repeat(8192) }])("rejects invalid metadata", (metadata) => {
    expect(isValidAnalyticsContext({ metadata })).toBe(false);
  });
  it("accepts metadata at the JSON length boundary", () => {
    const prefixLength = JSON.stringify({ value: "" }).length;
    expect(isValidAnalyticsContext({ metadata: { value: "a".repeat(8192 - prefixLength) } })).toBe(true);
  });
});
