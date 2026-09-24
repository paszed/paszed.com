"use client";

import { Menu, X } from "lucide-react";

interface MobileNavbarTriggerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function MobileNavbarTrigger({
  isOpen,
  onOpenChange,
}: MobileNavbarTriggerProps) {
  const Icon = isOpen ? X : Menu;

  return (
    <button
      data-analytics-id="navbar.mobile.menu-toggle"
      type="button"
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
      onClick={() => onOpenChange(!isOpen)}
      className="inline-flex size-10 items-center justify-center rounded-lg text-fg-secondary transition-colors duration-200 hover:bg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
    </button>
  );
}
