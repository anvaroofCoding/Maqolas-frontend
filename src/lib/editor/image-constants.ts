export const IMAGE_WIDTH_PRESETS = [
  { label: "Kichik", value: "33" },
  { label: "O'rta", value: "50" },
  { label: "Katta", value: "75" },
  { label: "To'liq", value: "100" },
] as const;

export type ImageAlign = "left" | "center" | "right";

export const IMAGE_ALIGN_OPTIONS: { label: string; value: ImageAlign }[] = [
  { label: "Chap", value: "left" },
  { label: "Markaz", value: "center" },
  { label: "O'ng", value: "right" },
];

export const MAX_EDITOR_IMAGE_MB = 8;
export const EDITOR_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif";
