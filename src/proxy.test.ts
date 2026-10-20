import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "./proxy";

function request(
  pathname: string,
  options: { language?: string; cookie?: string } = {},
) {
  const headers = new Headers();

  if (options.language) {
    headers.set("accept-language", options.language);
  }

  if (options.cookie) {
    headers.set("cookie", `NEXT_LOCALE=${options.cookie}`);
  }

  return new NextRequest(`https://paszed.com${pathname}`, { headers });
}

describe("proxy", () => {
  it("preserves explicitly localized URLs", () => {
    for (const pathname of ["/en/projects", "/de/about", "/hu/contact"]) {
      const response = proxy(request(pathname, { language: "de-DE" }));

      expect(response.headers.get("location")).toBeNull();
      expect(response.status).toBe(200);
    }
  });

  it("redirects the homepage to the browser's supported locale", () => {
    const response = proxy(request("/", { language: "de-AT,de;q=0.9" }));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://paszed.com/de");
  });

  it("preserves the page path when redirecting", () => {
    const response = proxy(
      request("/projects/example", { language: "hu-HU" }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://paszed.com/hu/projects/example",
    );
  });

  it("prioritizes a saved language over browser preferences", () => {
    const response = proxy(
      request("/about", { language: "de-DE", cookie: "hu" }),
    );

    expect(response.headers.get("location")).toBe(
      "https://paszed.com/hu/about",
    );
  });

  it("internally rewrites the homepage to English", () => {
    const response = proxy(request("/", { cookie: "en" }));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://paszed.com/en",
    );
  });

  it("internally rewrites unprefixed URLs when English is selected", () => {
    const response = proxy(
      request("/contact", { language: "de-DE", cookie: "en" }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://paszed.com/en/contact",
    );
  });

  it("internally rewrites to English without a supported preference", () => {
    const response = proxy(request("/specs", { language: "fr-FR" }));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      "https://paszed.com/en/specs",
    );
  });

  it("limits interception to the configured public routes", () => {
    expect(config.matcher).toEqual([
      "/",
      "/about",
      "/contact",
      "/specs",
      "/projects",
      "/projects/:path*",
    ]);
  });
});

