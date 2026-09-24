"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/features/language-switcher";
import { localizePath, type Locale } from "@/i18n";
import type { NavigationContent } from "@/types/navigation";
import { ThemeToggle } from "@/ui/primitives/theme-toggle";

interface MobileNavbarMenuActionsProps {
  content: NavigationContent;
  locale: Locale;
  onClose: () => void;
}

export function MobileNavbarMenuActions({
  content,
  locale,
  onClose,
}: MobileNavbarMenuActionsProps) {
  return (
    <>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <Link
        data-analytics-id="navbar.mobile.contact"
        href={localizePath("/contact", locale)}
        onClick={onClose}
        className="
          mt-4 inline-flex h-12 items-center justify-center rounded-xl
          bg-accent px-5 text-sm font-semibold text-accent-foreground
          transition-colors hover:bg-accent-hover
        "
      >
        {content.actions.contact}
      </Link>
    </>
  );
}
