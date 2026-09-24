"use client";

import Link from "next/link";

import { localizePath, type Locale } from "@/i18n";
import type { NavigationContent, NavigationItem } from "@/types/navigation";

interface MobileNavbarMenuItemProps {
  item: NavigationItem;
  content: NavigationContent;
  locale: Locale;
  onClose: () => void;
}

export function MobileNavbarMenuItem({
  item,
  content,
  locale,
  onClose,
}: MobileNavbarMenuItemProps) {
  const itemContent = content.items[item.id];

  return (
    <Link
      data-analytics-id={`navbar.mobile.${item.id}`}
      href={localizePath(item.href, locale)}
      onClick={onClose}
      className="flex min-h-14 items-center py-3 text-lg font-medium text-fg transition-colors hover:text-accent"
    >
      {itemContent.label}
    </Link>
  );
}
