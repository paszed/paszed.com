import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/ui/layout/container";
import { SectionLead } from "@/ui/typography";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleEmphasis?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  titleEmphasis,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("border-b border-border py-24 sm:py-28 lg:py-36", className)}>
      <Container>
        <div className="max-w-4xl">
          {eyebrow ? <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{eyebrow}</p> : null}
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            {title}{titleEmphasis ? <>{" "}<span className="text-fg-secondary">{titleEmphasis}</span></> : null}
          </h1>
          {description ? <SectionLead className="mt-7">{description}</SectionLead> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
