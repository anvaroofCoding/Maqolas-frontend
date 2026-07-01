"use client";

import { useEffect } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import {
  shouldSkipClickSparkles,
  spawnClickSparkles,
} from "@/lib/effects/click-sparkles";

export function ClickSparkles() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.clickSparklesEnabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (shouldSkipClickSparkles(event.target)) return;

      const target = event.target;
      if (target instanceof Element) {
        const selection = window.getSelection();
        if (
          selection &&
          !selection.isCollapsed &&
          target.closest(".maqolas-phrase-selectable")
        ) {
          return;
        }
      }

      spawnClickSparkles(
        event.clientX,
        event.clientY,
        settings.clickSparkleStyleId,
      );
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [settings.clickSparklesEnabled, settings.clickSparkleStyleId]);

  return null;
}
