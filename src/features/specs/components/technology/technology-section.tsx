import { SectionHeader } from "@/ui/patterns";
import type { SpecSection } from "../../types";
import { TechnologyCard } from "./technology-card";

interface TechnologySectionProps {
  sections: readonly SpecSection[];
}

export function TechnologySection({ sections }: TechnologySectionProps) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="border-b border-border">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <SectionHeader
              variant="specs"
              eyebrow={section.eyebrow}
              title={<>{section.title}{section.titleEmphasis ? <>{" "}<span className="text-fg-secondary">{section.titleEmphasis}</span></> : null}</>}
              description={section.description}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <TechnologyCard key={item.name} {...item} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
