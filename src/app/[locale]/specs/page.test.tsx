import { describe, expect, it } from "vitest";
import { getSpecs } from "@/content/specs";
import { createPageMetadata } from "@/lib/seo/metadata";
import SpecsPage, { generateMetadata } from "./page";

describe("localized specs page", () => {
  it.each(["en", "de", "hu"] as const)(
    "generates metadata and renders the page for %s", async (locale) => {
      const content = getSpecs(locale);
      expect(await generateMetadata({ params: Promise.resolve({ locale }) }))
        .toEqual(createPageMetadata({
          title: content.title,
          description: content.description,
          path: "/specs",
          locale,
        }));
      const page = await SpecsPage({ params: Promise.resolve({ locale }) });
      expect(page?.type).toBe("div");
      expect(page?.props.children).toHaveLength(2);
    },
  );

  it("rejects an invalid locale", async () => {
    const params = Promise.resolve({ locale: "xx" });
    expect(await generateMetadata({ params })).toEqual({});
    expect(await SpecsPage({ params })).toBeNull();
  });
});
