import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MobileNavigationProvider,
  useMobileNavigation,
} from "./mobile-navigation-provider";

function Consumer() {
  const { isMobileNavigationOpen, setIsMobileNavigationOpen } = useMobileNavigation();

  return (
    <button
      type="button"
      aria-expanded={isMobileNavigationOpen}
      onClick={() => setIsMobileNavigationOpen(!isMobileNavigationOpen)}
    >
      Toggle navigation
    </button>
  );
}

describe("MobileNavigationProvider", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    vi.restoreAllMocks();
  });

  it("throws when the hook is used outside its provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useMobileNavigation must be used within a MobileNavigationProvider.",
    );

    consoleError.mockRestore();
  });

  it("toggles navigation and restores the previous overflow value", () => {
    document.body.style.overflow = "scroll";

    const view = render(
      <MobileNavigationProvider>
        <Consumer />
      </MobileNavigationProvider>,
    );

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("scroll");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("scroll");

    view.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});
