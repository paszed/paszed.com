import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container, Section } from "@/ui/layout";
import { Eyebrow, SectionLead, SectionTitle } from "@/ui/typography";
import { PageHero, SectionHeader } from "@/ui/patterns";
import { Card } from "@/ui/primitives/card";
import { SocialIcon } from "@/ui/primitives/social-icon";
import { DropdownCaret } from "@/ui/navigation/dropdown/dropdown-caret";

describe("shared UI", () => {
  it("renders Container with children, classes, and native attributes", () => {
    render(<Container className="custom-container" data-testid="container">Content</Container>);
    const element = screen.getByTestId("container");
    expect(element).toHaveTextContent("Content");
    expect(element).toHaveClass("mx-auto", "max-w-7xl", "custom-container");
  });

  it.each([
    ["sm", "py-16"],
    ["md", "py-20"],
    ["lg", "py-24"],
  ] as const)("renders Section size %s", (size, expectedClass) => {
    render(<Section size={size} data-testid="section">{size}</Section>);
    expect(screen.getByTestId("section")).toHaveClass(expectedClass, "border-b");
  });

  it("uses Section defaults and supports disabling its border", () => {
    const { rerender } = render(<Section data-testid="section">Default</Section>);
    expect(screen.getByTestId("section")).toHaveClass("py-20", "border-b");
    rerender(<Section border={false} className="custom-section" data-testid="section">No border</Section>);
    expect(screen.getByTestId("section")).not.toHaveClass("border-b");
    expect(screen.getByTestId("section")).toHaveClass("custom-section");
  });

  it("renders typography components with their semantic elements and attributes", () => {
    render(
      <>
        <Eyebrow data-testid="eyebrow" className="custom-eyebrow">Eyebrow</Eyebrow>
        <SectionTitle id="section-title" className="custom-title">Title</SectionTitle>
        <SectionLead data-testid="lead" className="custom-lead">Description</SectionLead>
      </>,
    );
    expect(screen.getByTestId("eyebrow").tagName).toBe("P");
    expect(screen.getByTestId("eyebrow")).toHaveClass("custom-eyebrow");
    expect(screen.getByRole("heading", { name: "Title", level: 2 })).toHaveAttribute("id", "section-title");
    expect(screen.getByRole("heading", { name: "Title" })).toHaveClass("custom-title");
    expect(screen.getByTestId("lead").tagName).toBe("P");
    expect(screen.getByTestId("lead")).toHaveClass("custom-lead");
  });

  it("renders a minimal PageHero without optional content", () => {
    render(<PageHero title="Minimal hero" />);
    const heading = screen.getByRole("heading", { name: "Minimal hero", level: 1 });
    expect(heading).toBeInTheDocument();
    expect(screen.queryByText("Eyebrow")).not.toBeInTheDocument();
    expect(heading.querySelector("span")).toBeNull();
  });

  it("renders every optional PageHero field and custom classes", () => {
    render(
      <PageHero eyebrow="Eyebrow" title="Main" titleEmphasis="emphasis" description="Description" className="custom-hero">
        <a href="https://example.com/contact">Contact</a>
      </PageHero>,
    );
    const heading = screen.getByRole("heading", { name: "Main emphasis", level: 1 });
    expect(heading.querySelector("span")).toHaveTextContent("emphasis");
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "https://example.com/contact");
    expect(heading.closest("section")).toHaveClass("custom-hero");
  });

  it("renders a minimal SectionHeader with its default variant", () => {
    render(<SectionHeader title="Default heading" />);
    expect(screen.getByRole("heading", { name: "Default heading", level: 2 })).toHaveClass("mt-3");
    expect(screen.queryByText("Eyebrow")).not.toBeInTheDocument();
  });

  it("renders the default SectionHeader with optional content", () => {
    render(<SectionHeader eyebrow="Eyebrow" title="Heading" description="Description" className="custom-header" />);
    expect(screen.getByText("Eyebrow")).toHaveClass("text-[10px]");
    expect(screen.getByRole("heading", { name: "Heading" })).toHaveClass("mt-3");
    expect(screen.getByText("Description")).toHaveClass("mt-4");
    expect(screen.getByRole("heading", { name: "Heading" }).closest("header")).toHaveClass("custom-header");
  });

  it("renders the specs SectionHeader variant", () => {
    render(<SectionHeader variant="specs" eyebrow="Specifications" title="Hardware" description="Details" />);
    expect(screen.getByText("Specifications")).toHaveClass("text-sm");
    expect(screen.getByRole("heading", { name: "Hardware" })).toHaveClass("mt-8");
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders Card with its content, styling, and native attributes", () => {
    render(<Card className="custom-card" data-testid="card">Card content</Card>);
    const element = screen.getByTestId("card");
    expect(element.tagName).toBe("ARTICLE");
    expect(element).toHaveTextContent("Card content");
    expect(element).toHaveClass("rounded-xl", "custom-card");
  });

  it.each([
    ["GitHub", "group-hover:text-fg"],
    ["LinkedIn", "group-hover:text-[#0A66C2]"],
    ["X", "group-hover:text-fg"],
    ["Reddit", "group-hover:text-[#FF4500]"],
    ["Discord", "group-hover:text-[#5865F2]"],
    ["Email", "group-hover:text-accent"],
  ])("renders the %s social icon", (name, expectedClass) => {
    const { container } = render(<SocialIcon name={name} className="custom-icon" />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("transition-colors", "custom-icon", expectedClass);
  });

  it("renders nothing for an unknown social icon", () => {
    const { container } = render(<SocialIcon name="Unknown" />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each([false, true])("renders DropdownCaret with isOpen=%s", (isOpen) => {
    const { container } = render(<DropdownCaret isOpen={isOpen} className="custom-caret" />);
    const caret = container.querySelector("span");
    expect(caret).toHaveAttribute("aria-hidden", "true");
    expect(caret).toHaveTextContent("▾");
    expect(caret).toHaveClass("custom-caret");
    if (isOpen) expect(caret).toHaveClass("rotate-180");
    else expect(caret).not.toHaveClass("rotate-180");
  });

  it("renders DropdownCaret without an optional className", () => {
    const { container } = render(<DropdownCaret isOpen={false} />);
    expect(container.querySelector("span")).toHaveClass("transition-transform");
  });
});
