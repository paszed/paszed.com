import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDiscovery } from "@/analytics";
import type { SpecsContent } from "../types";
import { SpecsView } from "./specs-view";

vi.mock("@/analytics", () => ({
  useDiscovery: vi.fn(() => ({ current: null })),
}));
vi.mock("./hardware", () => ({
  HardwareSection: ({ hardware }: { hardware: SpecsContent["hardware"] }) => (
    <section data-testid="hardware-section">{hardware.title}</section>
  ),
}));
vi.mock("./technology", () => ({
  TechnologySection: ({ sections }: { sections: SpecsContent["sections"] }) => (
    <section data-testid="technology-section">{sections.map((section) => section.title).join(", ")}</section>
  ),
}));
vi.mock("./workflow", () => ({
  WorkflowSection: ({ workflow }: { workflow: SpecsContent["workflow"] }) => (
    <section data-testid="workflow-section">{workflow.title}</section>
  ),
}));
vi.mock("./specs-contact-section", () => ({
  SpecsContactSection: ({ contact, locale }: {
    contact: SpecsContent["contact"];
    locale: string;
  }) => (
    <section data-testid="specs-contact-section" data-locale={locale}>
      {contact.title}
    </section>
  ),
}));

const content: SpecsContent = {
  eyebrow: "Specifications",
  title: "My setup",
  description: "Tools and workflow.",
  updated: "2026",
  contact: {
    eyebrow: "Contact",
    title: "Start a project",
    titleEmphasis: "together.",
    description: "Get in touch.",
  },
  hardware: {
    eyebrow: "Hardware",
    title: "Machines",
    items: [{ name: "Mac mini", detail: "M4", description: "Development machine." }],
  },
  sections: [{
    id: "software",
    eyebrow: "Software",
    title: "Development tools",
    items: [{ name: "TypeScript", description: "Typed code.", icon: "TypeScript" }],
  }],
  workflow: {
    eyebrow: "Workflow",
    title: "Build and verify",
    items: ["Write tests."],
  },
};

describe("SpecsView", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each(["en", "de", "hu"] as const)(
    "registers discovery and composes the Specs page for %s",
    (locale) => {
      const discoveryRef: { current: HTMLDivElement | null } = { current: null };
      vi.mocked(useDiscovery).mockReturnValue(discoveryRef);

      render(<SpecsView content={content} locale={locale} />);

      expect(useDiscovery).toHaveBeenCalledExactlyOnceWith({
        type: "specs_view",
        target: "specs-page",
      });
      expect(discoveryRef.current).toBeInstanceOf(HTMLDivElement);
      expect(screen.getByTestId("hardware-section")).toHaveTextContent("Machines");
      expect(screen.getByTestId("technology-section")).toHaveTextContent("Development tools");
      expect(screen.getByTestId("workflow-section")).toHaveTextContent("Build and verify");
      expect(screen.getByTestId("specs-contact-section")).toHaveTextContent("Start a project");
      expect(screen.getByTestId("specs-contact-section")).toHaveAttribute("data-locale", locale);
    },
  );
});
