import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectMedia } from "./project-media";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));

describe("ProjectMedia", () => {
  it("renders a placeholder when media is absent", () => {
    const { container } = render(<ProjectMedia />);
    expect(screen.getByText("Project media")).toBeInTheDocument();
    expect(container.querySelector("[aria-hidden=true]")).not.toBeNull();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders media without an optional caption", () => {
    render(<ProjectMedia media={{ src: "/project.png", alt: "Project preview" }} />);
    expect(screen.getByRole("img", { name: "Project preview" })).toHaveAttribute(
      "data-src", "/project.png",
    );
    expect(screen.queryByText("Project media")).not.toBeInTheDocument();
    expect(document.querySelector("figcaption")).toBeNull();
  });

  it("renders an optional caption", () => {
    render(
      <ProjectMedia
        media={{ src: "/project.png", alt: "Project preview", caption: "Preview caption" }}
        priority
      />,
    );
    expect(screen.getByText("Preview caption").tagName).toBe("FIGCAPTION");
  });
});
