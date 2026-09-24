import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function SectionTitle({
  children,
  className,
  ...props
}: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

interface SectionLeadProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function SectionLead({
  children,
  className,
  ...props
}: SectionLeadProps) {
  return (
    <p
      className={cn(
        "max-w-2xl text-lg leading-8 text-fg-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
