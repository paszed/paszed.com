import { describe, expect, it } from "vitest";
import { site } from "./site";
import { metadata } from "./metadata";
import { projects } from "./projects";

describe("site configuration", () => {
  it("defines metadata from the canonical site configuration", () => {
    expect(metadata.metadataBase).toEqual(new URL(site.url));
    expect(metadata.title).toEqual({
      default: site.title,
      template: `%s | ${site.name}`,
    });
    expect(metadata.description).toBe(site.description);
    expect(metadata.applicationName).toBe(site.name);
    expect(metadata.authors).toEqual([{ name: site.owner, url: site.url }]);
    expect(metadata.creator).toBe(site.owner);
    expect(metadata.publisher).toBe(site.owner);
    expect(metadata.alternates).toEqual({ canonical: site.url });
    expect(metadata.icons).toEqual({
      icon: "/icon.svg",
      shortcut: "/favicon.ico",
      apple: "/brand/apple-touch-icon.png",
    });
    expect(metadata.openGraph).toEqual({
      type: "website",
      url: site.url,
      siteName: site.name,
      title: site.title,
      description: site.description,
      locale: site.locale,
      images: [{ url: "/brand/share-card.png", width: 1200, height: 630, alt: `${site.owner} — ${site.title}` }],
    });
    expect(metadata.twitter).toEqual({
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      creator: "@paszed_",
      images: ["/brand/share-card.png"],
    });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("defines the project slugs and repository link", () => {
    expect(projects["foundation-js"]).toEqual({ slug: "foundation-js" });
    expect(projects.notafund).toEqual({
      slug: "notafund",
      artwork: "/projects/notafund.svg",
      website: "https://notafund.com",
    });
    expect(projects["paszed-com"]).toEqual({
      slug: "paszed-com",
      links: [{
        label: "GitHub",
        href: "https://github.com/paszed/paszed.com",
      }],
    });
  });
});
