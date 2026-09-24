import { describe, expect, it } from "vitest";
import { getAbout } from "@/content/about";
import { createPageMetadata } from "@/lib/seo/metadata";
import AboutPage, { generateMetadata } from "./page";

describe("localized about page", () => {
  it.each(["en", "de", "hu"] as const)(
    "generates metadata and renders the page for %s", async (locale) => {
      const content = getAbout(locale);
      expect(await generateMetadata({ params: Promise.resolve({ locale }) }))
        .toEqual(createPageMetadata({
          title: content.title,
          description: content.introduction,
          path: "/about",
          locale,
        }));
      const page = await AboutPage({ params: Promise.resolve({ locale }) });
      expect(page?.props).toMatchObject({ content, locale });
    },
  );

  it("rejects an invalid locale", async () => {
    const params = Promise.resolve({ locale: "xx" });
    expect(await generateMetadata({ params })).toEqual({});
    expect(await AboutPage({ params })).toBeNull();
  });
});
