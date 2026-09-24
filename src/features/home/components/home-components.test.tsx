import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { HomeContent } from "../types/home";
import { ContactSection } from "./contact-section";
import { Hero } from "./hero";
import { HomeSection } from "./home-section";
import { IntroductionSection } from "./introduction-section";
import { WorkSection } from "./work-section";

const hero: HomeContent["hero"] = {
  eyebrow: "Hero eyebrow",
  title: "Build",
  titleEmphasis: "better.",
  description: "Hero description",
  primaryCta: { label: "Explore work", href: "/projects" },
};

const introduction: HomeContent["introduction"] = {
  eyebrow: "Introduction eyebrow",
  statement: "Independent",
  statementEmphasis: "engineering.",
  description: "Introduction description",
};

const section: HomeContent["capabilities"] = {
  eyebrow: "Section eyebrow",
  title: "Section title",
  titleEmphasis: "emphasis",
  description: "Section description",
  items: [
    { title: "First capability", description: "First description" },
    { title: "Second capability", description: "Second description" },
  ],
};

const contact: HomeContent["contact"] = {
  eyebrow: "Contact eyebrow",
  title: "Get in",
  titleEmphasis: "touch.",
  description: "Contact description",
  cta: { label: "Contact me", href: "/contact" },
};

describe("home components", () => {
  it("renders the hero and localizes its primary CTA", () => {
    render(<Hero content={hero} locale="de" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Build better.");
    expect(screen.getByText("Hero eyebrow")).toBeInTheDocument();
    expect(screen.getByText("Hero description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore work" })).toHaveAttribute(
      "href", "/de/projects",
    );
    expect(screen.getByRole("link", { name: "Explore work" })).toHaveAttribute(
      "data-analytics-id", "home.hero.primary-cta",
    );
  });

  it("renders the introduction", () => {
    render(<IntroductionSection content={introduction} />);
    expect(screen.getByText("Introduction eyebrow")).toBeInTheDocument();
    expect(screen.getByText(/Independent/)).toHaveTextContent(
      "Independent engineering.",
    );
    expect(screen.getByText("Introduction description")).toBeInTheDocument();
  });

  it.each(["capabilities", "approach"] as const)(
    "renders the %s section and all its items", (variant) => {
      render(<HomeSection content={section} variant={variant} id="section-test" />);
      const element = document.getElementById("section-test");
      expect(element).not.toBeNull();
      expect(within(element as HTMLElement).getByRole("heading", { level: 2 }))
        .toHaveTextContent("Section title emphasis");
      expect(screen.getByText("Section description")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "First capability" }))
        .toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Second capability" }))
        .toBeInTheDocument();
      expect(screen.getByText("First description")).toBeInTheDocument();
      expect(screen.getByText("Second description")).toBeInTheDocument();
    },
  );

  it("renders the contact CTA with its analytics identifier", () => {
    render(<ContactSection content={contact} />);
    expect(screen.getByRole("heading", { level: 2 }))
      .toHaveTextContent("Get in touch.");
    expect(screen.getByText("Contact description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute(
      "href", "/contact",
    );
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute(
      "data-analytics-id", "home.contact.cta",
    );
  });

  it("renders localized work links and their analytics identifiers", () => {
    render(
      <WorkSection
        eyebrow="Selected work"
        title="Projects"
        locale="hu"
        items={[
          {
            title: "Foundation",
            category: "Framework",
            description: "Reusable software",
            href: "/projects/foundation-js",
          },
          {
            title: "Personal site",
            category: "Website",
            description: "Personal website",
            href: "/projects/paszed-com",
          },
        ]}
      />,
    );
    expect(screen.getByText("Selected work")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Foundation/ })).toHaveAttribute(
      "href", "/hu/projects/foundation-js",
    );
    expect(screen.getByRole("link", { name: /Foundation/ })).toHaveAttribute(
      "data-analytics-id", "home.work./projects/foundation-js",
    );
    expect(screen.getByText("Personal website")).toBeInTheDocument();
  });
});
