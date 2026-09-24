"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { track } from "@/analytics";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <button
        data-analytics-id="preferences.theme.toggle"
        type="button"
        aria-label="Toggle theme"
        disabled
        className="inline-flex size-9 items-center justify-center rounded-md border border-border font-mono text-xs text-fg-muted opacity-70"
      >
        ◐
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      data-analytics-id="preferences.theme.toggle"
      type="button"
      onClick={() => {
        void track({
          type: "theme_change",
          path: window.location.pathname,
          context: {
            metadata: {
              fromTheme: resolvedTheme,
              toTheme: nextTheme,
            },
          },
        });
        setTheme(nextTheme);
      }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border font-mono text-xs text-fg-muted transition-colors hover:bg-surface hover:text-fg"
    >
      {isDark ? "☼" : "◐"}
    </button>
  );
}
