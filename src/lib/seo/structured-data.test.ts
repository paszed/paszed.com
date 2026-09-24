import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { createPersonSchema } from "./person-schema";
import { createWebsiteSchema } from "./website-schema";
import { serializeJsonLd } from "./components/json-ld";

describe("structured data", () => {
  it("describes the site owner", () => {
    expect(createPersonSchema()).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.owner,
      url: site.url,
    });
  });

  it("describes the multilingual website and links its publisher", () => {
    expect(createWebsiteSchema()).toMatchObject({
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      inLanguage: ["en", "de", "hu"],
      publisher: { "@id": `${site.url}/#person` },
    });
  });

  it("escapes script-closing sequences in JSON-LD", () => {
    const serialized = serializeJsonLd({
      "@context": "https://schema.org",
      name: "</script><script>alert(1)</script>",
    });

    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toMatchObject({
      name: "</script><script>alert(1)</script>",
    });
  });
});
