import type { Schema } from "./types";
import { site } from "@/config/site";

export function createWebsiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: ["en", "de", "hu"],
    publisher: { "@id": `${site.url}/#person` },
  };
}
