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
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { KeyboardShortcutsSheet } from "@/components/keyboard-shortcuts/keyboard-shortcuts-sheet";
import { useSettings } from "@/components/providers/settings-provider";
import { requestOnboardingRestart } from "@/lib/onboarding/storage";
import { matchesBinding } from "@/lib/keyboard-shortcuts/format";
import {
  findDuplicateAction,
  getResolvedShortcuts,
  loadShortcutOverrides,
  saveShortcutOverrides,
} from "@/lib/keyboard-shortcuts/storage";
import type {
  ShortcutActionId,
  ShortcutBinding,
  ShortcutOverrides,
} from "@/lib/keyboard-shortcuts/types";
import {
  OPEN_NOTIFICATIONS_EVENT,
  OPEN_RANDOM_ARTICLE_EVENT,
  OPEN_SEARCH_EVENT,
} from "@/lib/keyboard-shortcuts/types";
import { toast } from "@/lib/toast";

type KeyboardShortcutsContextValue = {
  shortcuts: ReturnType<typeof getResolvedShortcuts>;
  overrides: ShortcutOverrides;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  setShortcut: (actionId: ShortcutActionId, binding: ShortcutBinding) => boolean;
  resetShortcut: (actionId: ShortcutActionId) => void;
  resetAllShortcuts: () => void;
};

const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextValue | null>(null);

const INPUT_SKIP_SELECTOR =
  'input, textarea, select, [contenteditable="true"], .ProseMirror, [role="textbox"], [role="combobox"], [role="searchbox"]';

function shouldIgnoreShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(INPUT_SKIP_SELECTOR));
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { openSettings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [overrides, setOverrides] = useState<ShortcutOverrides>({});
  const [sheetOpen, setSheetOpen] = useState(false);

  const shortcuts = useMemo(
    () => getResolvedShortcuts(overrides),
    [overrides],
  );

  useEffect(() => {
    setMounted(true);
    setOverrides(loadShortcutOverrides());
  }, []);

  const persistOverrides = useCallback((next: ShortcutOverrides) => {
    setOverrides(next);
    saveShortcutOverrides(next);
  }, []);

  const setShortcut = useCallback(
    (actionId: ShortcutActionId, binding: ShortcutBinding) => {
      const duplicate = findDuplicateAction(actionId, binding, overrides);
      if (duplicate) {
        toast.error("Bu tugma kombinatsiyasi boshqa funksiyada ishlatilgan");
        return false;
      }

      persistOverrides({ ...overrides, [actionId]: binding });
      toast.success("Tugma kombinatsiyasi yangilandi");
      return true;
    },
    [overrides, persistOverrides],
  );

  const resetShortcut = useCallback(
    (actionId: ShortcutActionId) => {
      const next = { ...overrides };
      delete next[actionId];
      persistOverrides(next);
    },
    [overrides, persistOverrides],
  );

  const resetAllShortcuts = useCallback(() => {
    persistOverrides({});
    toast.success("Standart tugmalar tiklandi");
  }, [persistOverrides]);

  const executeAction = useCallback(
    (actionId: ShortcutActionId) => {
      switch (actionId) {
        case "search":
          window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
          return;
        case "write":
          router.push("/yozish");
          return;
        case "home":
          router.push("/");
          return;
        case "maqolalar":
          router.push("/maqolalar");
          return;
        case "rasmlar":
          router.push("/rasmlar");
          return;
        case "yangi":
          router.push("/yangi");
          return;
        case "mavzular":
          router.push("/mavzular");
          return;
        case "lenta":
          router.push("/lenta");
          return;
        case "notifications":
          window.dispatchEvent(new CustomEvent(OPEN_NOTIFICATIONS_EVENT));
          return;
        case "settings":
          openSettings();
          return;
        case "theme-toggle":
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          return;
        case "random-article":
          window.dispatchEvent(new CustomEvent(OPEN_RANDOM_ARTICLE_EVENT));
          return;
        case "ai-assistant":
          router.push("/ai");
          return;
        case "saved-phrases":
          router.push("/saqlangan-sozlar");
          return;
        case "profile":
          router.push("/profil");
          return;
        case "onboarding":
          requestOnboardingRestart();
          return;
        default:
          return;
      }
    },
    [openSettings, resolvedTheme, router, setTheme],
  );

  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const ignoreInput = shouldIgnoreShortcutTarget(event.target);

      for (const shortcut of shortcuts) {
        if (!matchesBinding(event, shortcut.binding)) continue;
        if (ignoreInput && !shortcut.allowInInput) continue;

        event.preventDefault();
        executeAction(shortcut.id);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [executeAction, mounted, shortcuts]);

  const value = useMemo(
    () => ({
      shortcuts,
      overrides,
      sheetOpen,
      openSheet: () => setSheetOpen(true),
      closeSheet: () => setSheetOpen(false),
      setShortcut,
      resetShortcut,
      resetAllShortcuts,
    }),
    [
      shortcuts,
      overrides,
      sheetOpen,
      setShortcut,
      resetShortcut,
      resetAllShortcuts,
    ],
  );

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <KeyboardShortcutsSheet />
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error(
      "useKeyboardShortcuts must be used within KeyboardShortcutsProvider",
    );
  }
  return context;
}
