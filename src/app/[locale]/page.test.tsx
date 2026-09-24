import { describe, expect, it } from "vitest";
import { getHome } from "@/content/home";
import { createPageMetadata } from "@/lib/seo/metadata";
import HomePage, { generateMetadata } from "./page";

describe("localized home page", () => {
  it.each(["en", "de", "hu"] as const)(
    "generates metadata for %s", async (locale) => {
      const content = getHome(locale);
      expect(await generateMetadata({ params: Promise.resolve({ locale }) }))
        .toEqual(createPageMetadata({
          title: content.hero.title,
          description: content.hero.description,
          path: "/",
          locale,
        }));
    },
  );

  it("uses English metadata for an invalid locale", async () => {
    const content = getHome("en");
    expect(await generateMetadata({ params: Promise.resolve({ locale: "xx" }) }))
      .toEqual(createPageMetadata({
        title: content.hero.title,
        description: content.hero.description,
        path: "/",
        locale: "en",
      }));
  });

  it("returns null for an invalid locale", async () => {
    expect(await HomePage({ params: Promise.resolve({ locale: "xx" }) }))
      .toBeNull();
  });

  it.each(["en", "de", "hu"] as const)(
    "renders the home page for %s", async (locale) => {
      const page = await HomePage({ params: Promise.resolve({ locale }) });
      expect(page).not.toBeNull();
      expect(page?.type).toBe("div");
      const children = Array.isArray(page?.props.children)
        ? page.props.children : [page?.props.children];
      expect(children).toHaveLength(6);
      if (locale === "en") {
        expect(children[0]).not.toBeNull();
      } else {
        expect(children[0]).toBeNull();
      }
    },
  );
});
