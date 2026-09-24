import Link from "next/link";

import { LanguageSwitcher } from "@/features/language-switcher";
import { localizePath, type Locale } from "@/i18n";
import type { NavigationContent } from "@/types/navigation";
import { ThemeToggle } from "@/ui/primitives/theme-toggle";

interface NavbarActionsProps {
  locale: Locale;
  content: NavigationContent;
}

export function NavbarActions({ locale, content }: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block">
        <LanguageSwitcher />
      </div>
      <ThemeToggle />
      <Link
        href={localizePath("/contact", locale)}
        className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
      >
        {content.actions.contactShort}
      </Link>
    </div>
  );
}
