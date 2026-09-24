import type { SpecsContent } from "../../types";

interface WorkflowSectionProps {
  workflow: SpecsContent["workflow"];
}

export function WorkflowSection({ workflow }: WorkflowSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-4">
          {workflow.items.map((item) => (
            <p key={item} className="text-base leading-7 text-fg-secondary sm:text-lg">
              {item}
            </p>
          ))}
        </div>
        <div>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{workflow.eyebrow}</p>
          <h2 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {workflow.title.slice(0, workflow.title.lastIndexOf(" "))}{" "}<span className="text-fg-secondary">{workflow.title.slice(workflow.title.lastIndexOf(" ") + 1)}</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
