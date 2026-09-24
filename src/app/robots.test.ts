import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${site.url}/sitemap.xml`,
    });
  });
});
