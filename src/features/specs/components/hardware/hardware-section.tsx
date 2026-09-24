import { SectionHeader } from "@/ui/patterns";
import type { SpecHardwareSection } from "../../types";
import { HardwareCard } from "./hardware-card";

interface HardwareSectionProps {
  hardware: SpecHardwareSection;
}

export function HardwareSection({ hardware }: HardwareSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <SectionHeader variant="specs" eyebrow={hardware.eyebrow} title={<>{hardware.title}{hardware.titleEmphasis ? <>{" "}<span className="text-fg-secondary">{hardware.titleEmphasis}</span></> : null}</>} description={hardware.description} />
        <div className="grid gap-5 md:grid-cols-2">
          {hardware.items.map((item) => (
            <HardwareCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
