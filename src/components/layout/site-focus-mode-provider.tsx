"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SiteFocusModeContextValue = {
  active: boolean;
  supported: boolean;
  toggle: () => Promise<void>;
  exit: () => Promise<void>;
};

const SiteFocusModeContext = createContext<SiteFocusModeContextValue | null>(
  null,
);

function getFullscreenElement() {
  return (
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element })
      .webkitFullscreenElement ??
    null
  );
}

async function requestFullscreen() {
  const element = document.documentElement;
  const request =
    element.requestFullscreen?.bind(element) ??
    (
      element as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
      }
    ).webkitRequestFullscreen?.bind(element);

  if (!request) return false;

  try {
    await request();
    return true;
  } catch {
    return false;
  }
}

async function exitFullscreen() {
  const exit =
    document.exitFullscreen?.bind(document) ??
    (
      document as Document & { webkitExitFullscreen?: () => Promise<void> | void }
    ).webkitExitFullscreen?.bind(document);

  if (!exit || !getFullscreenElement()) return;

  try {
    await exit();
  } catch {
    // Foydalanuvchi allaqachon chiqib ketgan bo'lishi mumkin
  }
}

function isFullscreenSupported() {
  if (typeof document === "undefined") return false;
  const element = document.documentElement;
  return Boolean(
    element.requestFullscreen ??
      (element as HTMLElement & { webkitRequestFullscreen?: () => void })
        .webkitRequestFullscreen,
  );
}

function syncFocusClass(active: boolean) {
  document.documentElement.classList.toggle("site-focus-mode", active);
}

export function SiteFocusModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isFullscreenSupported());

    const handleFullscreenChange = () => {
      const isActive = Boolean(getFullscreenElement());
      setActive(isActive);
      syncFocusClass(isActive);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      syncFocusClass(false);
    };
  }, []);

  const exit = useCallback(async () => {
    await exitFullscreen();
    setActive(false);
    syncFocusClass(false);
  }, []);

  const toggle = useCallback(async () => {
    if (active || getFullscreenElement()) {
      await exit();
      return;
    }

    const entered = await requestFullscreen();
    setActive(true);
    syncFocusClass(true);

    if (!entered && !supported) {
      return;
    }
  }, [active, exit, supported]);

  const value = useMemo(
    () => ({
      active,
      supported,
      toggle,
      exit,
    }),
    [active, exit, supported, toggle],
  );

  return (
    <SiteFocusModeContext.Provider value={value}>
      {children}
    </SiteFocusModeContext.Provider>
  );
}

export function useSiteFocusMode() {
  const context = useContext(SiteFocusModeContext);
  if (!context) {
    throw new Error("useSiteFocusMode must be used within SiteFocusModeProvider");
  }
  return context;
}
