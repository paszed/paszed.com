import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getAbout } from "@/content/about";
import type { Locale } from "@/i18n";
import type { SpecsContent } from "../types";
import { SpecsContactSection } from "./specs-contact-section";

const contact: SpecsContent["contact"] = {
  eyebrow: "Get in touch",
  title: "Build something",
  titleEmphasis: "together.",
  description: "Discuss a project or collaboration.",
};

describe("SpecsContactSection", () => {
  it.each([
    ["en", "/contact"],
    ["de", "/de/contact"],
    ["hu", "/hu/contact"],
  ] as const)("renders the localized CTA for %s", (locale: Locale, href) => {
    render(<SpecsContactSection contact={contact} locale={locale} />);

    expect(screen.getByText("Get in touch")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Build something together." })).toBeInTheDocument();
    expect(screen.getByText("Discuss a project or collaboration.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: getAbout(locale).contact.cta });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("data-analytics-id", "specs.contact.cta");
  });
});
