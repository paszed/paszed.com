"use client";

import Link from "next/link";

import { localizePath } from "@/i18n";
import type { NavigationContent, NavigationItem } from "@/types/navigation";

interface NavbarMenuItemProps {
  item: NavigationItem;
  locale: "en" | "de" | "hu";
  content: NavigationContent;
}

export function NavbarMenuItem({
  item,
  locale,
  content,
}: NavbarMenuItemProps) {
  const itemContent = content.items[item.id];

  return (
    <Link
      data-analytics-id={`navbar.desktop.${item.id}`}
      href={localizePath(item.href, locale)}
      className="text-sm font-medium tracking-[-0.01em] text-fg-secondary transition-colors duration-200 hover:text-fg"
    >
      {itemContent.label}
    </Link>
  );
}
