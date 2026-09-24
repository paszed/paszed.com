import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow, SectionLead, SectionTitle } from "@/ui/typography";

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  variant?: "default" | "specs";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
   className,
  variant = "default",
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-10 max-w-3xl", className)}>
      {eyebrow ? variant === "specs" ? <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-fg-secondary">{eyebrow}</p> : <Eyebrow>{eyebrow}</Eyebrow> : null}
      <SectionTitle className={variant === "specs" ? "mt-8 max-w-3xl text-4xl leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl" : "mt-3"}>{title}</SectionTitle>
      {description ? <SectionLead className="mt-4">{description}</SectionLead> : null}
    </header>
  );
}
