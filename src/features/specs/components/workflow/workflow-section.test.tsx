import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkflowSection } from "./workflow-section";

describe("WorkflowSection", () => {
  it("renders every workflow item and emphasizes the final title word", () => {
    const { container } = render(
      <WorkflowSection workflow={{
        eyebrow: "How I work",
        title: "A deliberate workflow",
        items: ["Research the problem.", "Build the solution.", "Verify the result."],
      }} />,
    );

    expect(screen.getByText("How I work")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "A deliberate workflow" })).toBeInTheDocument();
    expect(screen.getByText("Research the problem.")).toBeInTheDocument();
    expect(screen.getByText("Build the solution.")).toBeInTheDocument();
    expect(screen.getByText("Verify the result.")).toBeInTheDocument();
    expect(container.querySelector("h2 span")).toHaveTextContent("workflow");
    expect(container.querySelector("h2 span")).toHaveClass("text-fg-secondary");
  });

  it("handles a single-word title and an empty item list", () => {
    const { container } = render(
      <WorkflowSection workflow={{ eyebrow: "Process", title: "Execution", items: [] }} />,
    );
    expect(screen.getByRole("heading", { name: "Execution" })).toBeInTheDocument();
    expect(container.querySelector("h2 span")).toHaveTextContent("Execution");
    expect(container.querySelectorAll("section p")).toHaveLength(1);
  });
});
