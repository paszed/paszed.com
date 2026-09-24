import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SpecSection } from "../../types";
import { TechnologySection } from "./technology-section";

vi.mock("@/ui/patterns", () => ({
  SectionHeader: ({ eyebrow, title, description }: {
    eyebrow: string;
    title: React.ReactNode;
    description?: string;
  }) => (
    <header>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  ),
}));

vi.mock("./technology-card", () => ({
  TechnologyCard: ({ name, description, icon, detail }: {
    name: string;
    description: string;
    icon: string;
    detail?: string;
  }) => (
    <article data-testid="technology-card" data-icon={icon}>
      <h3>{name}</h3>
      <p>{description}</p>
      {detail ? <p>{detail}</p> : null}
    </article>
  ),
}));

const sections: readonly SpecSection[] = [
  {
    id: "languages",
    eyebrow: "01 / Languages",
    title: "Programming",
    titleEmphasis: "languages",
    description: "The languages in use.",
    items: [
      { name: "TypeScript", description: "Typed code.", icon: "TypeScript", detail: "Primary" },
      { name: "React", description: "UI development.", icon: "React" },
    ],
  },
  {
    id: "infrastructure",
    eyebrow: "02 / Infrastructure",
    title: "Infrastructure",
    items: [
      { name: "Cloudflare", description: "Edge services.", icon: "Cloudflare" },
    ],
  },
];

describe("TechnologySection", () => {
  it("renders multiple sections, headings, descriptions, and cards", () => {
    const { container } = render(<TechnologySection sections={sections} />);

    expect(container.querySelectorAll("section")).toHaveLength(2);
    expect(screen.getByText("01 / Languages")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Programming languages" })).toBeInTheDocument();
    expect(screen.getByText("The languages in use.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Infrastructure" })).toBeInTheDocument();
    expect(screen.getAllByTestId("technology-card")).toHaveLength(3);
    expect(screen.getByText("Typed code.")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Edge services.")).toBeInTheDocument();
    expect(screen.getAllByTestId("technology-card")[2]).toHaveAttribute("data-icon", "Cloudflare");
  });

  it("renders an empty section without technology cards", () => {
    render(<TechnologySection sections={[{ ...sections[0], items: [] }]} />);
    expect(screen.getByRole("heading", { name: "Programming languages" })).toBeInTheDocument();
    expect(screen.queryByTestId("technology-card")).not.toBeInTheDocument();
  });

  it("renders nothing when no sections are supplied", () => {
    const { container } = render(<TechnologySection sections={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
