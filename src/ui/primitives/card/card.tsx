import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        "transition-[border-color,transform,box-shadow] duration-300",
        "hover:-translate-y-0.5 hover:border-fg-muted hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}
