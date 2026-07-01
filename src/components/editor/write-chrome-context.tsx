"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WriteChromeContextValue = {
  chromeHidden: boolean;
  setChromeHidden: (hidden: boolean) => void;
  toggleChromeHidden: () => void;
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => void;
};

const WriteChromeContext = createContext<WriteChromeContextValue | null>(null);

export function WriteChromeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [chromeHidden, setChromeHidden] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if (!pathname?.startsWith("/yozish")) {
      setChromeHidden(false);
      setFocusMode(false);
      return;
    }

    if (window.matchMedia("(max-width: 767px)").matches) {
      setChromeHidden(true);
    }
  }, [pathname]);

  const toggleChromeHidden = useCallback(() => {
    setChromeHidden((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      chromeHidden,
      setChromeHidden,
      toggleChromeHidden,
      focusMode,
      setFocusMode,
    }),
    [chromeHidden, focusMode, toggleChromeHidden],
  );

  return (
    <WriteChromeContext.Provider value={value}>
      {children}
    </WriteChromeContext.Provider>
  );
}

export function useWriteChrome() {
  const context = useContext(WriteChromeContext);
  if (!context) {
    throw new Error("useWriteChrome must be used within WriteChromeProvider");
  }
  return context;
}
