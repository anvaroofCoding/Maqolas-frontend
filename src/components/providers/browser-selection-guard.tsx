"use client";

import { useEffect } from "react";
import {
  MAQOLAS_SITE_CHROME_SELECTOR,
  MAQOLAS_TEXT_SELECTABLE_SELECTOR,
} from "@/lib/browser-selection";

export function BrowserSelectionGuard() {
  useEffect(() => {
    const isPhraseSelectable = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest(MAQOLAS_TEXT_SELECTABLE_SELECTOR));
    };

    const handleSelectStart = (event: Event) => {
      if (isPhraseSelectable(event.target)) return;

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(MAQOLAS_SITE_CHROME_SELECTOR)
      ) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
    };

    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, []);

  return null;
}
