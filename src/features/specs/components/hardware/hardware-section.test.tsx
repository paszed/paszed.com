import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SpecHardwareSection } from "../../types";
import { HardwareSection } from "./hardware-section";

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

vi.mock("./hardware-card", () => ({
  HardwareCard: ({ name, detail, description, model }: {
    name: string;
    detail: string;
    description: string;
    model?: string;
  }) => (
    <article data-testid="hardware-card" data-model={model}>
      <h3>{name}</h3>
      <p>{detail}</p>
      <p>{description}</p>
    </article>
  ),
}));

const hardware: SpecHardwareSection = {
  eyebrow: "Hardware",
  title: "My",
  titleEmphasis: "machines",
  description: "The devices I use.",
  items: [
    {
      name: "Mac mini",
      detail: "M4",
      description: "Development machine.",
      model: "/models/mac-mini.glb",
    },
    {
      name: "Display",
      detail: "27 inch",
      description: "External monitor.",
    },
  ],
};

describe("HardwareSection", () => {
  it("renders the section header and each hardware card", () => {
    const { container } = render(<HardwareSection hardware={hardware} />);

    expect(container.querySelectorAll("section")).toHaveLength(1);
    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "My machines" })).toBeInTheDocument();
    expect(screen.getByText("The devices I use.")).toBeInTheDocument();
    expect(screen.getAllByTestId("hardware-card")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Mac mini" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Display" })).toBeInTheDocument();
    expect(screen.getAllByTestId("hardware-card")[0]).toHaveAttribute(
      "data-model", "/models/mac-mini.glb",
    );
  });

  it("handles an empty item list and a title without emphasis", () => {
    render(
      <HardwareSection hardware={{
        eyebrow: "Equipment",
        title: "Hardware",
        items: [],
      }} />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Hardware" })).toBeInTheDocument();
    expect(screen.queryByTestId("hardware-card")).not.toBeInTheDocument();
  });
});
