import { describe, expect, it } from "vitest";
import { getProjects } from "@/content/projects";
import { createPageMetadata } from "@/lib/seo/metadata";
import ProjectsPage, { generateMetadata } from "./page";

const descriptions = {
  en: "I’m preparing a selection of work to share here.",
  de: "Ich bereite eine Auswahl meiner Arbeiten vor, die ich hier vorstellen werde.",
  hu: "Hamarosan bemutatok itt néhány munkámat.",
} as const;

describe("localized projects page", () => {
  it.each(["en", "de", "hu"] as const)(
    "generates metadata and renders the placeholder for %s", async (locale) => {
      expect(await generateMetadata({ params: Promise.resolve({ locale }) }))
        .toEqual(createPageMetadata({
          title: getProjects(locale).title,
          description: descriptions[locale],
          path: "/projects",
          locale,
        }));
      const page = await ProjectsPage({ params: Promise.resolve({ locale }) });
      expect(page?.type).toBe("div");
      expect(page?.props.children).toHaveLength(3);
    },
  );

  it("rejects an invalid locale", async () => {
    const params = Promise.resolve({ locale: "xx" });
    expect(await generateMetadata({ params })).toEqual({});
    expect(await ProjectsPage({ params })).toBeNull();
  });
});
