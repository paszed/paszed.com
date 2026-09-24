"use client";

import { useDiscovery } from "@/analytics";
import type { SpecsContent } from "../types";
import type { Locale } from "@/i18n";
import { HardwareSection } from "./hardware";
import { TechnologySection } from "./technology";
import { WorkflowSection } from "./workflow";
import { SpecsContactSection } from "./specs-contact-section";

interface SpecsViewProps {
  content: SpecsContent;
  locale: Locale;
}

export function SpecsView({ content, locale }: SpecsViewProps) {
  const discoveryRef = useDiscovery({
    type: "specs_view",
    target: "specs-page",
  });

  return (
    <div ref={(element) => { discoveryRef.current = element; }}>
      <HardwareSection hardware={content.hardware} />
      <TechnologySection sections={content.sections} />
      <WorkflowSection workflow={content.workflow} />
      <SpecsContactSection contact={content.contact} locale={locale} />
    </div>
  );
}
