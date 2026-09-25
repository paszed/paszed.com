import type { ReactNode } from "react";
import {
  Inter,
  JetBrains_Mono,
} from "next/font/google";

import { AnalyticsProvider } from "@/analytics/components/analytics-provider";
import { metadata } from "@/config/metadata";
import { isLocale, locales } from "@/i18n";
import { Footer } from "@/layout/footer/footer";
import { MobileNavigationProvider } from "@/providers/mobile-navigation-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/ui/navigation/navbar/navbar";

import "../globals.css";

export { metadata };

const sans = Inter({
  subsets: ["latin"],
  variable: "--site-font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--site-font-mono",
  display: "swap",
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider>
          <MobileNavigationProvider>
            <div className="flex min-h-screen flex-col">
              <AnalyticsProvider />
              <Navbar />

              <main className="flex-1">{children}</main>

              <Footer locale={locale} />
            </div>
          </MobileNavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
