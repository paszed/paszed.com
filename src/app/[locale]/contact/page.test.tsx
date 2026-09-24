import { describe, expect, it } from "vitest";
import { getContact } from "@/content/contact";
import { createPageMetadata } from "@/lib/seo/metadata";
import ContactPage, { generateMetadata } from "./page";

describe("localized contact page", () => {
  it.each(["en", "de", "hu"] as const)(
    "generates metadata and renders the page for %s", async (locale) => {
      const content = getContact(locale);
      expect(await generateMetadata({ params: Promise.resolve({ locale }) }))
        .toEqual(createPageMetadata({
          title: content.title,
          description: content.description,
          path: "/contact",
          locale,
        }));
      const page = await ContactPage({ params: Promise.resolve({ locale }) });
      expect(page?.type).toBe("div");
      expect(page?.props.children).toHaveLength(2);
    },
  );

  it("rejects an invalid locale", async () => {
    const params = Promise.resolve({ locale: "xx" });
    expect(await generateMetadata({ params })).toEqual({});
    expect(await ContactPage({ params })).toBeNull();
  });
});
