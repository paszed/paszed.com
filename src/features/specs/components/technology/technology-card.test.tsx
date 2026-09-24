import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TechnologyCard } from "./technology-card";

vi.mock("./technology-icon", () => ({
  TechnologyIcon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid="technology-icon" data-name={name} className={className} />
  ),
}));

describe("TechnologyCard", () => {
  it("renders the name, description, detail, and icon", () => {
    render(
      <TechnologyCard
        name="TypeScript"
        description="Typed application code."
        icon="TypeScript"
        detail="Language"
      />,
    );

    expect(screen.getByRole("heading", { level: 3, name: "TypeScript" })).toBeInTheDocument();
    expect(screen.getByText("Typed application code.")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByTestId("technology-icon")).toHaveAttribute("data-name", "TypeScript");
    expect(screen.getByTestId("technology-icon")).toHaveClass("size-12", "sm:size-14");
  });

  it("omits the detail when it is not supplied", () => {
    render(
      <TechnologyCard name="React" description="Interface library." icon="React" />,
    );
    expect(screen.getByRole("heading", { name: "React" })).toBeInTheDocument();
    expect(screen.getByText("Interface library.")).toBeInTheDocument();
    expect(screen.queryByText("Language")).not.toBeInTheDocument();
  });

  it("omits an empty detail", () => {
    const { container } = render(
      <TechnologyCard name="React" description="Interface library." icon="React" detail="" />,
    );
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
