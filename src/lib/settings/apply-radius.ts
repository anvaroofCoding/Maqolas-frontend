import { getRadiusPreset } from "@/lib/settings/radius-presets";
import type { RadiusPresetId } from "@/lib/settings/types";

export function clearBorderRadius() {
  document.documentElement.style.removeProperty("--radius");
}

export function applyBorderRadius(presetId: RadiusPresetId) {
  const preset = getRadiusPreset(presetId);
  if (!preset || preset.value === null) {
    clearBorderRadius();
    return;
  }

  document.documentElement.style.setProperty("--radius", preset.value);
}
