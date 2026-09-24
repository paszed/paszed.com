"use client";

import { navigation } from "@/config/navigation";
import type { NavigationContent } from "@/types/navigation";
import type { Locale } from "@/i18n";
import { MobileNavbarMenuActions } from "./mobile-navbar-menu-actions";
import { MobileNavbarMenuItem } from "./mobile-navbar-menu-item";

interface MobileNavbarMenuProps {
  content: NavigationContent;
  locale: Locale;
  onClose: () => void;
}

export function MobileNavbarMenu({
  content,
  locale,
  onClose,
}: MobileNavbarMenuProps) {
  return (
    <nav
      aria-label={content.accessibility.primaryNavigation}
      className="mx-auto flex max-w-2xl flex-col"
    >
      <div className="divide-y divide-border-muted border-y border-border-muted">
        {navigation.map((item) => (
          <MobileNavbarMenuItem
            key={item.id}
            item={item}
            content={content}
            locale={locale}
            onClose={onClose}
          />
        ))}
      </div>

      <MobileNavbarMenuActions
        content={content}
        locale={locale}
        onClose={onClose}
      />
    </nav>
  );
}
