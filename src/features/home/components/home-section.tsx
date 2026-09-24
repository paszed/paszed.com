import type { HomeSection as HomeSectionContent } from "../types/home";

interface HomeSectionProps {
  content: HomeSectionContent;
  variant: "capabilities" | "approach";
  id?: string;
}

export function HomeSection({ content, id, variant }: HomeSectionProps) {
  const isProcess = variant === "approach";

  return (
    <section id={id} className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">
            {content.eyebrow}
          </p>

          <div>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              {content.title}{" "}
              <span className="text-fg-secondary">{content.titleEmphasis}</span>
            </h2>

            <p className="mt-10 max-w-2xl text-base leading-8 text-fg-secondary sm:text-lg">
              {content.description}
            </p>
          </div>
        </div>

        {isProcess ? (
          <div className="mx-auto mt-20 grid max-w-6xl gap-12 border-t border-border pt-12 md:grid-cols-3 md:gap-12 lg:mt-24 lg:gap-16 lg:pt-16">
            {content.items.map((item) => (
              <article key={item.title}>
                <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-sm text-base leading-8 text-fg-secondary sm:text-lg">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-20 grid max-w-6xl gap-12 border-t border-border pt-12 md:grid-cols-3 md:gap-12 lg:mt-24 lg:gap-16 lg:pt-16">
            {content.items.map((item) => (
              <article key={item.title}>
                <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-sm text-base leading-8 text-fg-secondary sm:text-lg">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
