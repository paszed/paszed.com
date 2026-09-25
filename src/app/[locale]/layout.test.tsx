import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LocaleLayout, { generateStaticParams, metadata } from "./layout";
import { metadata as siteMetadata } from "@/config/metadata";
import { locales } from "@/i18n";

const fontMock = vi.hoisted(() => vi.fn());

vi.mock("next/font/google", () => ({
  Inter: (options: unknown) => {
    fontMock("Inter", options);
    return { variable: "font-sans" };
  },
  JetBrains_Mono: (options: unknown) => {
    fontMock("JetBrains_Mono", options);
    return { variable: "font-mono" };
  },
}));

vi.mock("@/analytics/components/analytics-provider", () => ({
  AnalyticsProvider: () => <div data-testid="analytics-provider" />,
}));

vi.mock("@/providers/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

vi.mock("@/providers/mobile-navigation-provider", () => ({
  MobileNavigationProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-navigation-provider">{children}</div>
  ),
}));

vi.mock("@/ui/navigation/navbar/navbar", () => ({
  Navbar: () => <nav data-testid="navbar" />,
}));

vi.mock("@/layout/footer/footer", () => ({
  Footer: ({ locale }: { locale: string }) => (
    <footer data-testid="footer" data-locale={locale} />
  ),
}));

describe("LocaleLayout", () => {
  it("exports the site metadata and generates all supported locale params", () => {
    expect(metadata).toBe(siteMetadata);
    expect(generateStaticParams()).toEqual(
      locales.map((locale) => ({ locale })),
    );
  });

  it("applies both font families to the document", async () => {
    const layout = await LocaleLayout({
      children: <p>Page content</p>,
      params: Promise.resolve({ locale: "en" }),
    });

    expect(layout).not.toBeNull();
    expect(layout?.props.className).toBe("font-sans font-mono");
  });

  it.each(locales)("renders the %s document and application shell", async (locale) => {
    const layout = await LocaleLayout({
      children: <p>Page content</p>,
      params: Promise.resolve({ locale }),
    });

    render(layout);

    expect(document.documentElement).toHaveAttribute("lang", locale);
    expect(document.documentElement).toHaveClass(
      "font-sans", "font-mono",
    );
    expect(screen.getByTestId("theme-provider")).toContainElement(
      screen.getByTestId("mobile-navigation-provider"),
    );
    expect(screen.getByTestId("mobile-navigation-provider")).toContainElement(
      screen.getByTestId("analytics-provider"),
    );
    expect(screen.getByRole("main")).toHaveTextContent("Page content");
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toHaveAttribute("data-locale", locale);
  });

  it("returns null for an unsupported locale", async () => {
    const layout = await LocaleLayout({
      children: <p>Should not render</p>,
      params: Promise.resolve({ locale: "unsupported" }),
    });

    expect(layout).toBeNull();
  });
});
