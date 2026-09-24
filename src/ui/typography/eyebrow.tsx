import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function Eyebrow({
  children,
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
