import { getThemePreset } from "@/lib/settings/theme-presets";
import type { AccentColors, MaqolasSettings } from "@/lib/settings/types";

const ACCENT_CSS_VARS = [
  "--primary",
  "--ring",
  "--nav-active",
  "--nav-active-hover",
  "--sidebar-primary",
] as const;

function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return [r, g, b];
  }
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return [r, g, b];
}

function darkenRgb([r, g, b]: [number, number, number], amount = 0.15) {
  const factor = 1 - amount;
  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

function buildCustomAccent(hex: string, isDark: boolean): AccentColors {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    const fallback = getThemePreset("indigo");
    return isDark ? fallback!.dark : fallback!.light;
  }

  const navActive = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const navActiveHover = darkenRgb(rgb, isDark ? 0.1 : 0.18);

  return {
    primary: navActive,
    ring: navActive,
    navActive,
    navActiveHover,
    sidebarPrimary: navActive,
  };
}

function applyAccentColors(colors: AccentColors) {
  const root = document.documentElement;
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--ring", colors.ring);
  root.style.setProperty("--nav-active", colors.navActive);
  root.style.setProperty("--nav-active-hover", colors.navActiveHover);
  root.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
}

export function clearAccentTheme() {
  const root = document.documentElement;
  for (const variable of ACCENT_CSS_VARS) {
    root.style.removeProperty(variable);
  }
}

export function applyAccentTheme(settings: MaqolasSettings, isDark: boolean) {
  if (settings.themePresetId === "indigo") {
    clearAccentTheme();
    return;
  }

  if (settings.themePresetId === "custom") {
    applyAccentColors(buildCustomAccent(settings.customAccentColor, isDark));
    return;
  }

  const preset = getThemePreset(settings.themePresetId);
  if (!preset) {
    clearAccentTheme();
    return;
  }

  applyAccentColors(isDark ? preset.dark : preset.light);
}
