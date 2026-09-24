import Image from "next/image";
import Link from "next/link";

import type { AboutContent } from "../types";
import { localizePath, type Locale } from "@/i18n";

interface AboutViewProps {
  content: AboutContent;
  locale: Locale;
}

export function AboutView({ content, locale }: AboutViewProps) {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid overflow-hidden border border-border lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative min-h-[24rem] bg-muted/20 sm:min-h-[30rem] lg:min-h-[36rem]">
              <Image
                src="/images/about.jpg"
                alt={content.profile.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center grayscale"
                priority
              />
            </div>
            <div className="flex flex-col justify-center border-t border-border p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-14">
              <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.profile.role}</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                {content.profile.name.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-fg-secondary">{content.profile.name.split(" ").at(-1)}</span>
              </h1>
              <div className="mt-10 max-w-xl space-y-6 text-base leading-8 text-fg-secondary lg:mt-12">
                {content.profile.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8 lg:py-36">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.perspective.eyebrow}</p>
          <h2 className="mt-8 max-w-6xl text-4xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
            {content.perspective.lead}{" "}
            <span className="text-fg-secondary">{content.perspective.emphasis}</span>
          </h2>
          <p className="mt-10 max-w-2xl text-lg leading-8 text-fg-secondary">
            {content.perspective.description}
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:px-8 lg:py-32">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.work.eyebrow}</p>
          <div>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              {content.work.lead}{" "}
              <span className="text-fg-secondary">{content.work.emphasis}</span>
            </h2>
            <div className="mt-10 max-w-2xl space-y-6 text-base leading-8 text-fg-secondary sm:text-lg">
              {content.work.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8 lg:py-36">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.principle.eyebrow}</p>
          <h2 className="mt-8 max-w-6xl text-4xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
            {content.principle.lead}{" "}
            <span className="text-fg-secondary">{content.principle.emphasis}</span>
          </h2>
          <p className="mt-10 max-w-2xl text-lg leading-8 text-fg-secondary">
            {content.principle.description}
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
          <div>
            <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.contact.eyebrow}</p>
            <h2 className="mt-8 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {content.contact.lead}{" "}
              <span className="text-fg-secondary">{content.contact.emphasis}</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-fg-secondary">
              {content.contact.description}
            </p>
          </div>
          <Link
            data-analytics-id="about.contact.cta"
            href={localizePath("/contact", locale)}
            className="mt-10 inline-flex min-h-11 items-center rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {content.contact.cta} <span aria-hidden="true" className="ml-3">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
