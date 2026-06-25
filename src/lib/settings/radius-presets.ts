import type { RadiusPresetId } from "@/lib/settings/types";

export interface RadiusPreset {
  id: RadiusPresetId;
  name: string;
  /** null = CSS standart qiymati (--radius o'chiriladi) */
  value: string | null;
  previewRadius: string;
}

export const RADIUS_PRESETS: RadiusPreset[] = [
  {
    id: "default",
    name: "Standart",
    value: null,
    previewRadius: "0.625rem",
  },
  {
    id: "none",
    name: "Yo'q",
    value: "0",
    previewRadius: "0",
  },
  {
    id: "small",
    name: "Kichik",
    value: "0.375rem",
    previewRadius: "0.375rem",
  },
  {
    id: "medium",
    name: "O'rta",
    value: "0.625rem",
    previewRadius: "0.625rem",
  },
  {
    id: "large",
    name: "Katta",
    value: "1rem",
    previewRadius: "1rem",
  },
];

export function getRadiusPreset(id: RadiusPresetId): RadiusPreset | undefined {
  return RADIUS_PRESETS.find((preset) => preset.id === id);
}
