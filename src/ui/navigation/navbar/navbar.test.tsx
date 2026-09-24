import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { navigation } from "@/config/navigation";
import { localizePath } from "@/i18n";
import { getNavigation } from "@/content/navigation";
import { MobileNavigationProvider } from "@/providers/mobile-navigation-provider";
import { Navbar } from "./navbar";

// Prevent jsdom from attempting document navigation after link clicks.
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) {
    event.preventDefault();
  }
});

const mocks = vi.hoisted(() => ({ pathname: "/en/projects" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("@/features/language-switcher", () => ({
  LanguageSwitcher: () => <span data-testid="language-switcher" />,
}));

vi.mock("@/ui/primitives/theme-toggle", () => ({
  ThemeToggle: () => <span data-testid="theme-toggle" />,
}));

function renderNavbar(pathname = "/en/projects") {
  mocks.pathname = pathname;
  return render(
    <MobileNavigationProvider>
      <Navbar />
    </MobileNavigationProvider>,
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    mocks.pathname = "/en/projects";
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it.each(["en", "de", "hu"] as const)(
    "renders localized desktop navigation for %s",
    (locale) => {
      renderNavbar(`/${locale}/projects`);
      const content = getNavigation(locale);
      const desktop = screen.getByRole("navigation", {
        name: content.accessibility.primaryNavigation,
      });

      expect(screen.getByRole("link", { name: "Paszed home" })).toHaveAttribute(
        "href",
        localizePath("/", locale),
      );

      for (const item of navigation) {
        const link = within(desktop).getByRole("link", {
          name: content.items[item.id].label,
        });
        expect(link).toHaveAttribute("href", localizePath(item.href, locale));
        expect(link).toHaveAttribute(
          "data-analytics-id",
          `navbar.desktop.${item.id}`,
        );
      }

      expect(screen.getByRole("link", {
        name: content.actions.contactShort,
      })).toHaveAttribute("href", localizePath("/contact", locale));
      expect(screen.getAllByTestId("language-switcher")).toHaveLength(1);
      expect(screen.getAllByTestId("theme-toggle")).toHaveLength(1);
    },
  );

  it("opens and closes the mobile menu and restores body scrolling", () => {
    renderNavbar();
    const trigger = screen.getByRole("button", { name: "Open navigation" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("navigation")).toHaveLength(1);

    fireEvent.click(trigger);

    const close = screen.getByRole("button", { name: "Close navigation" });
    expect(close).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getAllByRole("navigation")).toHaveLength(2);
    expect(screen.getAllByTestId("language-switcher")).toHaveLength(2);
    expect(screen.getAllByTestId("theme-toggle")).toHaveLength(2);

    fireEvent.click(close);

    expect(screen.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(document.body.style.overflow).toBe("");
  });

  it.each(["en", "de", "hu"] as const)(
    "renders localized mobile links and closes after selecting one for %s",
    (locale) => {
      renderNavbar(`/${locale}/about`);
      fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));

      const content = getNavigation(locale);
      const mobile = screen.getAllByRole("navigation", {
        name: content.accessibility.primaryNavigation,
      })[1];

      for (const item of navigation) {
        const link = within(mobile).getByRole("link", {
          name: content.items[item.id].label,
        });
        expect(link).toHaveAttribute("href", localizePath(item.href, locale));
        expect(link).toHaveAttribute(
          "data-analytics-id",
          `navbar.mobile.${item.id}`,
        );
      }

      const contact = within(mobile).getByRole("link", {
        name: content.actions.contact,
      });
      expect(contact).toHaveAttribute("href", localizePath("/contact", locale));
      expect(contact).toHaveAttribute(
        "data-analytics-id",
        "navbar.mobile.contact",
      );

      fireEvent.click(within(mobile).getByRole("link", {
        name: content.items.projects.label,
      }));

      expect(screen.getAllByRole("navigation")).toHaveLength(1);
      expect(document.body.style.overflow).toBe("");
    },
  );

  it("closes the mobile menu after selecting contact", () => {
    renderNavbar();
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    fireEvent.click(screen.getByRole("link", {
      name: getNavigation("en").actions.contact,
    }));

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(document.body.style.overflow).toBe("");
  });

  it("restores the previous body overflow when unmounted while open", () => {
    document.body.style.overflow = "scroll";
    const view = renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(document.body.style.overflow).toBe("hidden");

    view.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});
