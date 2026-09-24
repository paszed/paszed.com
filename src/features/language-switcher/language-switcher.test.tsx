import { track } from "@/analytics";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./language-switcher";

const mocks = vi.hoisted(() => ({ pathname: "/" as string | null }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("@/analytics", () => ({
  track: vi.fn().mockResolvedValue(undefined),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mocks.pathname = "/";
  });

  it("renders the current locale and starts closed", () => {
    const { container } = render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /EN$/ });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger.parentElement).toHaveAttribute("data-hydrated", "true");
    expect(container.querySelector("[role=menu]")).not.toBeInTheDocument();
  });

  it("opens the menu and links to the other locales", () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /EN$/ });

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: /DE$/ })).toHaveAttribute("href", "/de");
    expect(screen.getByRole("menuitem", { name: /HU$/ })).toHaveAttribute("href", "/hu");
    expect(screen.queryByRole("menuitem", { name: /EN$/ })).not.toBeInTheDocument();
  });

  it("preserves the page when switching from German", () => {
    mocks.pathname = "/de/projects";
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: /DE$/ }));

    expect(screen.getByRole("menuitem", { name: /EN$/ })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("menuitem", { name: /HU$/ })).toHaveAttribute("href", "/hu/projects");
    expect(screen.queryByRole("menuitem", { name: /DE$/ })).not.toBeInTheDocument();
  });

  it("opens on focus and closes on mouse leave", () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /EN$/ });

    fireEvent.focus(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.mouseLeave(trigger.parentElement!);
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.mouseEnter(trigger.parentElement!);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes when clicking outside the switcher", () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /EN$/ });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes after selecting another language", () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /EN$/ });

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitem", { name: /DE$/ }), { defaultPrevented: true });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("tracks the selected language and original path", () => {
    mocks.pathname = "/de/projects";
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: /DE$/ }));
    fireEvent.click(screen.getByRole("menuitem", { name: /HU$/ }), { defaultPrevented: true });

    expect(track).toHaveBeenCalledWith({
      type: "language_change",
      path: "/hu/projects",
      previousPath: "/de/projects",
      context: {
        metadata: {
          fromLocale: "de",
          toLocale: "hu",
        },
      },
    });
  });

  it("uses the homepage when Next.js returns a null pathname", () => {
    mocks.pathname = null;
    render(<LanguageSwitcher />);

    const trigger = screen.getByRole("button", { name: /EN$/ });
    fireEvent.click(trigger);

    expect(screen.getByRole("menuitem", { name: /DE$/ })).toHaveAttribute("href", "/de");
    expect(screen.getByRole("menuitem", { name: /HU$/ })).toHaveAttribute("href", "/hu");
  });

  it("stays open when pointer-down occurs inside the switcher", () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /EN$/ });
    fireEvent.click(trigger);

    fireEvent.pointerDown(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
