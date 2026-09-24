"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DropdownCaret } from "@/ui/navigation/dropdown/dropdown-caret";

import { getLocaleFromPath } from "./lib/get-locale-from-path";
import { LanguageSwitcherMenu } from "./language-switcher-menu";

const localeFlags = {
  en: "🇬🇧",
  de: "🇩🇪",
  hu: "🇭🇺",
} as const;

const localeLabels = {
  en: "EN",
  de: "DE",
  hu: "HU",
} as const;

export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLocale = getLocaleFromPath(pathname);

  function openMenu() {
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    containerRef.current?.setAttribute("data-hydrated", "true");

    function handlePointerDown(event: PointerEvent) {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        data-analytics-id="preferences.language.menu"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={openMenu}
        onFocus={openMenu}
        className="inline-flex h-10 items-center gap-1.5 px-2 text-fg-secondary transition-colors duration-200 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <span className="text-[18px] leading-none">
          {localeFlags[currentLocale]}
        </span>
        <span className="sr-only">{localeLabels[currentLocale]}</span>
        <DropdownCaret isOpen={isOpen} />
      </button>

      {isOpen ? (
        <LanguageSwitcherMenu
          pathname={pathname}
          currentLocale={currentLocale}
          onClose={closeMenu}
        />
      ) : null}
    </div>
  );
}
