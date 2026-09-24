"use client";


import { track } from "@/analytics";
import { MenuPopover } from "@/ui/overlays";
import { getLocalizedPath } from "./lib/get-localized-path";

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

const locales = ["en", "de", "hu"] as const;

interface LanguageSwitcherMenuProps {
  pathname: string;
  currentLocale: keyof typeof localeFlags;
  onClose: () => void;
}

export function LanguageSwitcherMenu({
  pathname,
  currentLocale,
  onClose,
}: LanguageSwitcherMenuProps) {
  return (
    <div role="menu" className="absolute left-1/2 top-full z-50 min-w-28 -translate-x-1/2 pt-2">
      <MenuPopover>
        {locales
          .filter((locale) => locale !== currentLocale)
          .map((locale) => (
            <a
              key={locale}
              data-analytics-id={`preferences.language.${locale}`}
              href={getLocalizedPath(pathname, locale)}
              role="menuitem"
              onClick={() => {
                void track({
                  type: "language_change",
                  path: getLocalizedPath(pathname, locale),
                  previousPath: pathname,
                  context: {
                    metadata: {
                      fromLocale: currentLocale,
                      toLocale: locale,
                    },
                  },
                });
                onClose();
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="text-[18px] leading-none">
                {localeFlags[locale]}
              </span>
              <span>{localeLabels[locale]}</span>
            </a>
          ))}
      </MenuPopover>
    </div>
  );
}
