"use client";

import Link from "next/link";

import { trackGithubClick } from "@/analytics";

import { BrandWordmark } from "@/brand";
import { footerNavigation, footerSocials } from "@/config/footer";
import { site } from "@/config/site";
import { getFooter } from "@/content/footer";
import { localizePath, type Locale } from "@/i18n";
import { SocialIcon } from "@/ui/primitives/social-icon";
import { Container } from "@/ui";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const content = getFooter(locale);
  const year = new Date().getFullYear();
  const copyright = content.bottom.copyright
    .replace("{year}", String(year))
    .replace("{owner}", site.owner);

  return (
    <footer className="border-t border-border">
      <Container>
        <div className="py-16 sm:py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[minmax(16rem,1.2fr)_minmax(0,3.8fr)] lg:gap-20">
            <div className="max-w-sm">
              <BrandWordmark href={localizePath("/", locale)} className="text-base sm:text-lg" />
              <p className="mt-3 max-w-xs text-base leading-7 text-fg-secondary">
                {content.brand.description}
              </p>
            </div>

            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <section>
                <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-muted">
                  {content.navigation.title}
                </h2>
                <nav
                  className="mt-5 flex flex-col gap-3"
                  aria-label={content.navigation.title}
                >
                  {footerNavigation.map((link) => (
                    <Link
                      key={link.id}
                      data-analytics-id={`footer.navigation.${link.id}`}
                      href={localizePath(link.href, locale)}
                      className="w-fit text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      {content.navigation.labels[link.id]}
                    </Link>
                  ))}
                </nav>
              </section>

              <section>
                <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-fg-muted">
                  {content.social.title}
                </h2>
                <nav className="mt-5 flex flex-col gap-3" aria-label={content.social.ariaLabel}>
                  {footerSocials.map((social) => (
                    <a
                      key={social.id}
                      data-analytics-id={`footer.social.${social.id}`}
                      href={social.href}
                      onClick={social.id === "github" ? () => trackGithubClick(social.href) : undefined}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group inline-flex w-fit items-center gap-2.5 text-sm text-fg-secondary transition-colors hover:text-fg"
                    >
                      <SocialIcon
                        name={social.label}
                        className="size-4 opacity-70 group-hover:opacity-100"
                      />
                      {social.label}
                    </a>
                  ))}
                </nav>
              </section>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <p>{content.bottom.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
