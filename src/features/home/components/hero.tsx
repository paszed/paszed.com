import Link from "next/link";

import type { HomeHero } from "../types/home";
import { localizePath, type Locale } from "@/i18n";
import { Container } from "@/ui";

interface HeroProps {
  content: HomeHero;
  locale: Locale;
}

export function Hero({ content, locale }: HeroProps) {
  return (
    <section className="border-b border-border">
      <Container>
        <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-24 text-center sm:py-28 lg:py-32">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.eyebrow}</p>

          <h1 className="mt-8 max-w-6xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            {content.title}{" "}
          <span className="text-fg-secondary">{content.titleEmphasis}</span>
          </h1>

          <p className="mt-9 max-w-2xl text-lg leading-8 text-fg-secondary sm:text-xl">
            {content.description}
          </p>

          <Link
            data-analytics-id="home.hero.primary-cta"
            href={localizePath(content.primaryCta.href, locale)}
            className="mt-10 inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {content.primaryCta.label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
