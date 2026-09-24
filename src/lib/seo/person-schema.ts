import type { Schema } from "./types";
import { site } from "@/config/site";

export function createPersonSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.owner,
    url: site.url,
    image: `${site.url}/images/profile.jpg`,
  };
}
