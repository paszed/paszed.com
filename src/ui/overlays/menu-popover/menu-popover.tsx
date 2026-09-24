import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MenuPopoverProps {
  children: ReactNode;
  className?: string;
}

export function MenuPopover({
  children,
  className,
}: MenuPopoverProps) {
  return (
    <div
      className={cn(
        `
          overflow-hidden
          rounded-xl
          border
          border-border-muted
          bg-background/98
          p-2
          shadow-lg
          backdrop-blur-xl
        `,
        className,
      )}
    >
      {children}
    </div>
  );
}
