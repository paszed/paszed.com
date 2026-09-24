"use client";

import { usePathname } from "next/navigation";

import { BrandWordmark } from "@/brand";
import { getNavigation } from "@/content/navigation";
import { getLocale, localizePath } from "@/i18n";
import { useMobileNavigation } from "@/providers/mobile-navigation-provider";
import { MobileNavbarMenu } from "./mobile-navbar-menu";
import { MobileNavbarTrigger } from "./mobile-navbar-trigger";
import { NavbarActions } from "./navbar-actions";
import { NavbarMenu } from "./navbar-menu";

export function Navbar() {
  const pathname = usePathname();
  const locale = getLocale(pathname.split("/")[1]);
  const content = getNavigation(locale);
  const {
    isMobileNavigationOpen,
    setIsMobileNavigationOpen,
  } = useMobileNavigation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 lg:px-10">
        <div
          className="grid h-[5rem] grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]"
        >
          <div className="justify-self-start">
            <BrandWordmark href={localizePath("/", locale)} />
          </div>

          <div className="hidden -translate-x-8 lg:block">
            <NavbarMenu
              locale={locale}
              content={content}
            />
          </div>

          <div className="hidden justify-self-end lg:block">
            <NavbarActions locale={locale} content={content} />
          </div>

          <div className="justify-self-end lg:hidden">
            <MobileNavbarTrigger
              isOpen={isMobileNavigationOpen}
              onOpenChange={setIsMobileNavigationOpen}
            />
          </div>
        </div>
      </div>

      {isMobileNavigationOpen ? (
        <div className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border-muted bg-background px-5 py-6 shadow-xl lg:hidden">
          <MobileNavbarMenu
            locale={locale}
            content={content}
            onClose={() => setIsMobileNavigationOpen(false)}
          />
        </div>
      ) : null}
    </header>
  );
}
