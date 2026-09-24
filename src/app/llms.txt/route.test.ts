import { describe, expect, it } from "vitest";

import { site } from "@/config/site";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("returns current site information and published routes", async () => {
    const response = GET();
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    expect(body).toContain(site.owner);
    expect(body).toContain(`${site.url}/about`);
    expect(body).toContain(`${site.url}/contact`);
    expect(body).toContain(`${site.url}/sitemap.xml`);
    expect(body).not.toContain("paszed.me");
    expect(body).not.toContain(`${site.url}/journal`);
    expect(body).not.toContain(`${site.url}/rss.xml`);
  });
});
