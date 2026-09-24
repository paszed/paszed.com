import Link from "next/link";
import type { HomeWorkItem } from "../types/home";
import { localizePath, type Locale } from "@/i18n";
import { Container } from "@/ui";
import { Eyebrow } from "@/ui/typography";

interface WorkSectionProps {
  eyebrow: string;
  title: string;
  items: readonly HomeWorkItem[];
  locale: Locale;
}

export function WorkSection({ eyebrow, title, items, locale }: WorkSectionProps) {
  return (
    <section className="border-b border-border">
      <Container>
        <div className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-24 lg:py-32">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-[1] tracking-[-0.045em] sm:text-5xl">
              {title}
            </h2>
          </div>

          <div className="border-t border-border">
            {items.map((item) => (
              <Link
                key={item.title}
                data-analytics-id={`home.work.${item.href}`}
                href={localizePath(item.href, locale)}
                className="group grid gap-5 border-b border-border py-8 transition-colors hover:bg-surface/40 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:px-3"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-medium tracking-[-0.025em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-fg-secondary">
                    {item.description}
                  </p>
                </div>
                <span aria-hidden="true" className="hidden text-lg text-fg-muted transition-transform group-hover:translate-x-1 sm:block">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
