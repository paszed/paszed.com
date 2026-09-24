import Link from "next/link";

import { getAbout } from "@/content/about";
import { localizePath, type Locale } from "@/i18n";
import type { SpecsContent } from "../types";
import { Container } from "@/ui";

interface SpecsContactSectionProps {
  contact: SpecsContent["contact"];
  locale: Locale;
}

export function SpecsContactSection({ contact, locale }: SpecsContactSectionProps) {
  return (
    <section className="border-b border-border">
      <Container>
        <div className="flex flex-col items-center py-24 text-center lg:py-32">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{contact.eyebrow}</p>
          <h2 className="mt-8 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            {contact.title}{" "}<span className="text-fg-secondary">{contact.titleEmphasis}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-fg-secondary">{contact.description}</p>
          <Link
            data-analytics-id="specs.contact.cta"
            href={localizePath("/contact", locale)}
            className="mt-10 inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {getAbout(locale).contact.cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
