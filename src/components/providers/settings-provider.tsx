"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyAccentTheme } from "@/lib/settings/apply-theme";
import { loadSettings, saveSettings } from "@/lib/settings/storage";
import {
  DEFAULT_SETTINGS,
  type MaqolasSettings,
} from "@/lib/settings/types";

interface SettingsContextValue {
  settings: MaqolasSettings;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
  updateSettings: (patch: Partial<MaqolasSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<MaqolasSettings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveSettings(settings);
  }, [mounted, settings]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const isDark = resolvedTheme === "dark";
    applyAccentTheme(settings, isDark);
  }, [mounted, settings, resolvedTheme]);

  const updateSettings = useCallback((patch: Partial<MaqolasSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({
      settings,
      settingsOpen,
      openSettings,
      closeSettings,
      setSettingsOpen,
      updateSettings,
      resetSettings,
    }),
    [
      settings,
      settingsOpen,
      openSettings,
      closeSettings,
      updateSettings,
      resetSettings,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
