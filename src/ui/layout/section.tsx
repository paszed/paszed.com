import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionSize = "sm" | "md" | "lg";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  size?: SectionSize;
  border?: boolean;
}

const sizeClasses: Record<SectionSize, string> = {
  sm: "py-16 sm:py-20 lg:py-24",
  md: "py-20 sm:py-24 lg:py-32",
  lg: "py-24 sm:py-28 lg:py-36",
};

export function Section({
  children,
  className,
  size = "md",
  border = true,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        border && "border-b border-border",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
