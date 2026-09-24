import type { HomeIntroduction } from "../types/home";
import { Container } from "@/ui";

interface IntroductionSectionProps {
  content: HomeIntroduction;
}

export function IntroductionSection({ content }: IntroductionSectionProps) {
  return (
    <section className="border-b border-border">
      <Container>
        <div className="py-24 sm:py-28 lg:py-40">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{content.eyebrow}</p>

          <p className="mt-10 max-w-6xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {content.statement}{" "}
          <span className="text-fg-secondary">{content.statementEmphasis}</span>
          </p>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-fg-secondary sm:text-xl sm:leading-9">
            {content.description}
          </p>
        </div>
      </Container>
    </section>
  );
}
