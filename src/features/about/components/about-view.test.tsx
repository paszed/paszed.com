import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AboutContent } from "../types";
import { AboutView } from "./about-view";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));

const content: AboutContent = {
  eyebrow: "About",
  title: "About me",
  introduction: "Introduction",
  profile: {
    name: "Edvard Pasz",
    role: "Developer",
    bio: ["First biography paragraph.", "Second biography paragraph."],
  },
  perspective: {
    eyebrow: "Perspective",
    lead: "Build with",
    emphasis: "purpose.",
    description: "Perspective description",
  },
  work: {
    eyebrow: "Work",
    title: "Work title",
    lead: "My",
    emphasis: "work.",
    paragraphs: ["First work paragraph.", "Second work paragraph."],
  },
  principle: {
    eyebrow: "Principle",
    lead: "Keep it",
    emphasis: "simple.",
    description: "Principle description",
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact title",
    lead: "Get in",
    emphasis: "touch.",
    description: "Contact description",
    cta: "Contact me",
  },
};

describe("AboutView", () => {
  it("renders the profile, sections, and localized contact CTA", () => {
    render(<AboutView content={content} locale="de" />);
    expect(screen.getByRole("img", { name: "Edvard Pasz" })).toHaveAttribute(
      "data-src", "/images/about.jpg",
    );
    expect(screen.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Edvard Pasz");
    for (const paragraph of [
      ...content.profile.bio, ...content.work.paragraphs,
    ]) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByText("Perspective description")).toBeInTheDocument();
    expect(screen.getByText("Principle description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact me/ })).toHaveAttribute(
      "href", "/de/contact",
    );
    expect(screen.getByRole("link", { name: /Contact me/ })).toHaveAttribute(
      "data-analytics-id", "about.contact.cta",
    );
  });
});
