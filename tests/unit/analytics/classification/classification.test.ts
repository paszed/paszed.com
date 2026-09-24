import { describe, expect, it } from "vitest";
import { isBotUserAgent } from "../../../../src/analytics/classification/bot";
import { classifyTraffic } from "../../../../src/analytics/classification/crawler";

describe("isBotUserAgent", () => {
  it.each(["Googlebot", "CustomCrawler", "FriendlySpider", "HeadlessChrome", "LinkPreview", "WhatsApp"])("detects %s", (ua) => {
    expect(isBotUserAgent(ua)).toBe(true);
  });
  it.each(["", "Mozilla/5.0 Safari/605.1"])("does not flag %s", (ua) => {
    expect(isBotUserAgent(ua)).toBe(false);
  });
});

describe("classifyTraffic", () => {
  it.each(["", "Googlebot", "Twitterbot", "CustomScraper", "Mozilla/5.0 Safari/605.1"])("classifies %s", (ua) => {
    const expected = ua === "" ? "unknown" : ua === "Googlebot" ? "crawler" : ua === "Twitterbot" ? "preview" : ua === "CustomScraper" ? "bot" : "human";
    expect(classifyTraffic(ua)).toBe(expected);
  });
  it("prioritizes previews over crawlers and crawlers over generic bots", () => {
    expect(classifyTraffic("Googlebot Twitterbot CustomScraper")).toBe("preview");
    expect(classifyTraffic("Googlebot CustomScraper")).toBe("crawler");
  });
});
