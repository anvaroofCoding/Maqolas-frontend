import { THEME_PRESETS } from "@/lib/settings/theme-presets";
import { RADIUS_PRESETS } from "@/lib/settings/radius-presets";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  type RadiusPresetId,
  type ThemePresetId,
} from "@/lib/settings/types";

const VALID_RADIUS_PRESET_IDS = new Set<RadiusPresetId>([
  "default",
  "none",
  "small",
  "medium",
  "large",
]);

const VALID_PRESET_IDS = new Set<ThemePresetId>([
  "indigo",
  "emerald",
  "rose",
  "amber",
  "sky",
  "violet",
  "orange",
  "teal",
  "fuchsia",
  "slate",
  "custom",
]);

const presetColors = Object.fromEntries(
  THEME_PRESETS.map((preset) => [
    preset.id,
    { light: preset.light, dark: preset.dark },
  ]),
);

const radiusValues = Object.fromEntries(
  RADIUS_PRESETS.map((preset) => [preset.id, preset.value]),
);

function buildAccentThemeInitScript() {
  return `
(function () {
  try {
    var presets = ${JSON.stringify(presetColors)};
    var radiusValues = ${JSON.stringify(radiusValues)};
    var storageKey = ${JSON.stringify(SETTINGS_STORAGE_KEY)};
    var defaultPreset = ${JSON.stringify(DEFAULT_SETTINGS.themePresetId)};
    var defaultRadiusPreset = ${JSON.stringify(DEFAULT_SETTINGS.borderRadiusPresetId)};
    var defaultCustom = ${JSON.stringify(DEFAULT_SETTINGS.customAccentColor)};
    var validPresets = ${JSON.stringify([...VALID_PRESET_IDS])};
    var validRadiusPresets = ${JSON.stringify([...VALID_RADIUS_PRESET_IDS])};

    function hexToRgb(hex) {
      var normalized = hex.replace("#", "").trim();
      if (normalized.length === 3) {
        return [
          parseInt(normalized[0] + normalized[0], 16),
          parseInt(normalized[1] + normalized[1], 16),
          parseInt(normalized[2] + normalized[2], 16),
        ];
      }
      if (normalized.length !== 6) return null;
      var r = parseInt(normalized.slice(0, 2), 16);
      var g = parseInt(normalized.slice(2, 4), 16);
      var b = parseInt(normalized.slice(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return [r, g, b];
    }

    function darkenRgb(rgb, amount) {
      var factor = 1 - amount;
      return (
        "rgb(" +
        Math.round(rgb[0] * factor) +
        ", " +
        Math.round(rgb[1] * factor) +
        ", " +
        Math.round(rgb[2] * factor) +
        ")"
      );
    }

    function buildCustomAccent(hex, isDark) {
      var rgb = hexToRgb(hex);
      var fallback = presets.indigo[isDark ? "dark" : "light"];
      if (!rgb) return fallback;

      var navActive = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
      var navActiveHover = darkenRgb(rgb, isDark ? 0.1 : 0.18);

      return {
        primary: navActive,
        ring: navActive,
        navActive: navActive,
        navActiveHover: navActiveHover,
        sidebarPrimary: navActive,
      };
    }

    function isDarkMode() {
      var theme = localStorage.getItem("theme");
      if (theme === "dark") return true;
      if (theme === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function isValidHexColor(value) {
      return (
        typeof value === "string" &&
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
      );
    }

    var raw = localStorage.getItem(storageKey);
    var parsed = raw ? JSON.parse(raw) : null;
    var presetId =
      parsed &&
      parsed.themePresetId &&
      validPresets.indexOf(parsed.themePresetId) !== -1
        ? parsed.themePresetId
        : defaultPreset;
    var customColor =
      parsed && isValidHexColor(parsed.customAccentColor)
        ? parsed.customAccentColor
        : defaultCustom;
    var radiusPresetId =
      parsed &&
      parsed.borderRadiusPresetId &&
      validRadiusPresets.indexOf(parsed.borderRadiusPresetId) !== -1
        ? parsed.borderRadiusPresetId
        : defaultRadiusPreset;

    var root = document.documentElement;
    var radiusValue = radiusValues[radiusPresetId];
    if (radiusValue === null || radiusValue === undefined) {
      root.style.removeProperty("--radius");
    } else {
      root.style.setProperty("--radius", radiusValue);
    }

    if (presetId === "indigo") return;

    var isDark = isDarkMode();
    var colors;

    if (presetId === "custom") {
      colors = buildCustomAccent(customColor, isDark);
    } else {
      var preset = presets[presetId];
      if (!preset) return;
      colors = isDark ? preset.dark : preset.light;
    }

    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--ring", colors.ring);
    root.style.setProperty("--nav-active", colors.navActive);
    root.style.setProperty("--nav-active-hover", colors.navActiveHover);
    root.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
  } catch (_) {}
})();
`;
}

export function AccentThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: buildAccentThemeInitScript() }}
    />
  );
}
