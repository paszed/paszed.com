"use client";

import { navigation } from "@/config/navigation";
import type { NavigationContent } from "@/types/navigation";
import { NavbarMenuItem } from "./navbar-menu-item";

interface NavbarMenuProps {
  locale: "en" | "de" | "hu";
  content: NavigationContent;
}

export function NavbarMenu({ locale, content }: NavbarMenuProps) {
  return (
    <nav
      aria-label={content.accessibility.primaryNavigation}
      className="hidden items-center gap-14 lg:flex"
    >
      {navigation.map((item) => (
        <NavbarMenuItem
          key={item.id}
          item={item}
          locale={locale}
          content={content}
        />
      ))}
    </nav>
  );
}
