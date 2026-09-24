import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TechnologyIconName } from "../../types";
import { TechnologyIcon } from "./technology-icon";

const names: readonly TechnologyIconName[] = [
  "TypeScript", "Next.js", "React", "Tailwind CSS", "Node.js",
  "pnpm", "Ghostty", "Fish", "Neovim", "Unix", "Homebrew",
  "Git", "GitHub", "Supabase", "Vercel", "Cloudflare",
  "Docker", "Stripe", "ChatGPT", "Claude", "Figma",
  "Excalidraw", "Motion",
];

describe("TechnologyIcon", () => {
  it.each(names)("renders the icon for %s", (name) => {
    const { container } = render(<TechnologyIcon name={name} />);
    const icon = container.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
    expect(icon).toHaveClass("size-5", "shrink-0");
  });

  it("merges a custom class name", () => {
    const { container } = render(
      <TechnologyIcon name="React" className="size-12 custom-icon" />,
    );
    const icon = container.querySelector("svg");
    expect(icon).toHaveClass("size-12", "custom-icon", "shrink-0");
    expect(icon).not.toHaveClass("size-5");
  });

  it("renders nothing for an unsupported name", () => {
    const { container } = render(<TechnologyIcon name="Unknown technology" />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
