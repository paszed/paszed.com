import { Card } from "@/ui";
import { TechnologyIcon } from "./technology-icon";

interface TechnologyCardProps {
  name: string;
  description: string;
  icon: string;
  detail?: string;
}

export function TechnologyCard({
  name,
  description,
  icon,
  detail,
}: TechnologyCardProps) {
  return (
    <Card className="group">
      <div className="relative flex min-h-52 items-center justify-center overflow-hidden border-b border-border bg-background">
        <div aria-hidden="true" className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(128,128,128,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
        <TechnologyIcon name={icon} className="relative size-12 sm:size-14" />
      </div>
      <div className="p-5 sm:p-6">
        {detail ? <p className="font-mono text-xs uppercase tracking-[0.14em] text-fg-muted">{detail}</p> : null}
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-fg">{name}</h3>
        <p className="mt-2 text-sm leading-6 text-fg-secondary">{description}</p>
      </div>
    </Card>
  );
}
