"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface MobileNavigationContextValue {
  isMobileNavigationOpen: boolean;
  setIsMobileNavigationOpen: (isOpen: boolean) => void;
}

const MobileNavigationContext = createContext<MobileNavigationContextValue | undefined>(undefined);

interface MobileNavigationProviderProps {
  children: ReactNode;
}

export function MobileNavigationProvider({ children }: MobileNavigationProviderProps) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

  useEffect(() => {
    if (!isMobileNavigationOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileNavigationOpen]);

  return (
    <MobileNavigationContext.Provider value={{ isMobileNavigationOpen, setIsMobileNavigationOpen }}>
      {children}
    </MobileNavigationContext.Provider>
  );
}

export function useMobileNavigation() {
  const context = useContext(MobileNavigationContext);

  if (!context) {
    throw new Error("useMobileNavigation must be used within a MobileNavigationProvider.");
  }

  return context;
}
