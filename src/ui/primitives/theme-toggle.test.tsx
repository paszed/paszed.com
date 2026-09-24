import { renderToStaticMarkup } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { track } from "@/analytics";

import { ThemeToggle } from "./theme-toggle";

const mocks = vi.hoisted(() => ({
  resolvedTheme: "light" as string | undefined,
  setTheme: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mocks.resolvedTheme,
    setTheme: mocks.setTheme,
  }),
}));

vi.mock("@/analytics", () => ({
  track: vi.fn().mockResolvedValue(undefined),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolvedTheme = "light";
    window.history.replaceState({}, "", "/de/projects");
  });

  it("renders a disabled placeholder before hydration", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);

    expect(html).toContain("Toggle theme");
    expect(html).toContain("disabled");
    expect(html).toContain("◐");
    expect(html).not.toContain("Switch to dark theme");
    expect(mocks.setTheme).not.toHaveBeenCalled();
  });

  it("switches from light to dark and tracks the change", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Switch to dark theme" });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("data-analytics-id", "preferences.theme.toggle");
    expect(button).toHaveTextContent("◐");

    fireEvent.click(button);

    expect(mocks.setTheme).toHaveBeenCalledExactlyOnceWith("dark");
    expect(track).toHaveBeenCalledExactlyOnceWith({
      type: "theme_change",
      path: "/de/projects",
      context: {
        metadata: {
          fromTheme: "light",
          toTheme: "dark",
        },
      },
    });
  });

  it("switches from dark to light and tracks the change", () => {
    mocks.resolvedTheme = "dark";
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Switch to light theme" });
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("☼");

    fireEvent.click(button);

    expect(mocks.setTheme).toHaveBeenCalledExactlyOnceWith("light");
    expect(track).toHaveBeenCalledExactlyOnceWith({
      type: "theme_change",
      path: "/de/projects",
      context: {
        metadata: {
          fromTheme: "dark",
          toTheme: "light",
        },
      },
    });
  });
});
