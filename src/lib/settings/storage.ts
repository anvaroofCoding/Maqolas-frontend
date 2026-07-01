import {
  DEFAULT_CLICK_SPARKLE_STYLE,
  VALID_CLICK_SPARKLE_STYLE_IDS,
} from "@/lib/effects/click-sparkle-styles";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  type MaqolasSettings,
  type NotificationSoundId,
  type RadiusPresetId,
  type ThemePresetId,
} from "@/lib/settings/types";

const VALID_SOUND_IDS = new Set<NotificationSoundId>([
  "ding",
  "chime",
  "pop",
  "bell",
  "digital",
  "whoosh",
  "marimba",
  "bubble",
  "alert",
  "melody",
]);

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

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function loadSettings(): MaqolasSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<MaqolasSettings>;
    return {
      themePresetId:
        parsed.themePresetId && VALID_PRESET_IDS.has(parsed.themePresetId)
          ? parsed.themePresetId
          : DEFAULT_SETTINGS.themePresetId,
      borderRadiusPresetId:
        parsed.borderRadiusPresetId &&
        VALID_RADIUS_PRESET_IDS.has(parsed.borderRadiusPresetId)
          ? parsed.borderRadiusPresetId
          : DEFAULT_SETTINGS.borderRadiusPresetId,
      customAccentColor: isValidHexColor(parsed.customAccentColor)
        ? parsed.customAccentColor
        : DEFAULT_SETTINGS.customAccentColor,
      notificationSoundId:
        parsed.notificationSoundId &&
        VALID_SOUND_IDS.has(parsed.notificationSoundId)
          ? parsed.notificationSoundId
          : DEFAULT_SETTINGS.notificationSoundId,
      aiAssistEnabled:
        typeof parsed.aiAssistEnabled === "boolean"
          ? parsed.aiAssistEnabled
          : DEFAULT_SETTINGS.aiAssistEnabled,
      navbarWeatherEnabled:
        typeof parsed.navbarWeatherEnabled === "boolean"
          ? parsed.navbarWeatherEnabled
          : DEFAULT_SETTINGS.navbarWeatherEnabled,
      clickSparklesEnabled:
        typeof parsed.clickSparklesEnabled === "boolean"
          ? parsed.clickSparklesEnabled
          : DEFAULT_SETTINGS.clickSparklesEnabled,
      clickSparkleStyleId:
        parsed.clickSparkleStyleId &&
        VALID_CLICK_SPARKLE_STYLE_IDS.has(parsed.clickSparkleStyleId)
          ? parsed.clickSparkleStyleId
          : DEFAULT_SETTINGS.clickSparkleStyleId,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: MaqolasSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
