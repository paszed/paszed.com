import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "@/layout/footer/footer";
import { ContactView } from "@/features/contact/components/contact-view";
import { footerNavigation, footerSocials } from "@/config/footer";
import { site } from "@/config/site";
import { getFooter } from "@/content/footer";
import { localizePath } from "@/i18n";

const analytics = vi.hoisted(() => ({
  trackGithubClick: vi.fn(),
  trackContactCta: vi.fn(),
}));

vi.mock("@/analytics", () => analytics);

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(["en", "de", "hu"] as const)("renders localized footer content and navigation for %s", (locale) => {
    const content = getFooter(locale);
    render(<Footer locale={locale} />);

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getAllByText(content.brand.description).length).toBeGreaterThan(0);
    expect(within(footer).getByRole("link", { name: "Paszed home" })).toHaveAttribute(
      "href", localizePath("/", locale),
    );

    const navigation = within(footer).getByRole("navigation", {
      name: content.navigation.title,
    });
    for (const link of footerNavigation) {
      const anchor = within(navigation).getByRole("link", {
        name: content.navigation.labels[link.id],
      });
      expect(anchor).toHaveAttribute("href", localizePath(link.href, locale));
      expect(anchor).toHaveAttribute("data-analytics-id", `footer.navigation.${link.id}`);
    }

    const copyright = content.bottom.copyright
      .replace("{year}", String(new Date().getFullYear()))
      .replace("{owner}", site.owner);
    expect(within(footer).getByText(copyright)).toBeInTheDocument();
    expect(within(footer).getAllByText(content.bottom.tagline).length).toBeGreaterThan(0);
  });

  it.each(["en", "de", "hu"] as const)("renders social links and external-link attributes for %s", (locale) => {
    const content = getFooter(locale);
    render(<Footer locale={locale} />);
    const socialNavigation = screen.getByRole("navigation", {
      name: content.social.ariaLabel,
    });

    for (const social of footerSocials) {
      const anchor = within(socialNavigation).getByRole("link", { name: social.label });
      expect(anchor).toHaveAttribute("href", social.href);
      expect(anchor).toHaveAttribute("data-analytics-id", `footer.social.${social.id}`);
      expect(anchor.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      if (social.href.startsWith("http")) {
        expect(anchor).toHaveAttribute("target", "_blank");
        expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
      } else {
        expect(anchor).not.toHaveAttribute("target");
        expect(anchor).not.toHaveAttribute("rel");
      }
    }
  });

  it("tracks GitHub clicks without tracking other social links as GitHub clicks", () => {
    render(<Footer locale="en" />);
    const navigation = screen.getByRole("navigation", {
      name: getFooter("en").social.ariaLabel,
    });
    const github = footerSocials.find((social) => social.id === "github");
    expect(github).toBeDefined();
    fireEvent.click(within(navigation).getByRole("link", { name: "GitHub" }));
    expect(analytics.trackGithubClick).toHaveBeenCalledExactlyOnceWith(github!.href);

    fireEvent.click(within(navigation).getByRole("link", { name: "LinkedIn" }));
    fireEvent.click(within(navigation).getByRole("link", { name: "Email" }));
    expect(analytics.trackGithubClick).toHaveBeenCalledTimes(1);
  });
});

describe("ContactView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both email links and tracks each CTA independently", () => {
    const content = {
      eyebrow: "Contact",
      title: "Get in touch",
      description: "Contact details",
      emailLabel: "Email address",
      email: "hello@example.com",
      availability: "Available for projects.",
      sendEmailLabel: "Send an email",
    };
    render(<ContactView content={content} />);

    expect(screen.getByText(content.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(content.availability)).toBeInTheDocument();

    const address = screen.getByRole("link", { name: content.email });
    const send = screen.getByRole("link", { name: content.sendEmailLabel });
    for (const anchor of [address, send]) {
      expect(anchor).toHaveAttribute("href", `mailto:${content.email}`);
    }
    expect(address).toHaveAttribute("data-analytics-id", "contact.email-address");
    expect(send).toHaveAttribute("data-analytics-id", "contact.send-email");

    fireEvent.click(address);
    expect(analytics.trackContactCta).toHaveBeenNthCalledWith(1, "email-address");
    fireEvent.click(send);
    expect(analytics.trackContactCta).toHaveBeenNthCalledWith(2, "send-email");
    expect(analytics.trackContactCta).toHaveBeenCalledTimes(2);
  });
});
