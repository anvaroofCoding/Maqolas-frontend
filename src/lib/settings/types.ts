export type NotificationSoundId =
  | "ding"
  | "chime"
  | "pop"
  | "bell"
  | "digital"
  | "whoosh"
  | "marimba"
  | "bubble"
  | "alert"
  | "melody";

export type ThemePresetId =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "sky"
  | "violet"
  | "orange"
  | "teal"
  | "fuchsia"
  | "slate"
  | "custom";

export type RadiusPresetId =
  | "default"
  | "none"
  | "small"
  | "medium"
  | "large";

export interface AccentColors {
  primary: string;
  ring: string;
  navActive: string;
  navActiveHover: string;
  sidebarPrimary: string;
}

export interface ThemePreset {
  id: Exclude<ThemePresetId, "custom">;
  name: string;
  swatch: string;
  light: AccentColors;
  dark: AccentColors;
}

export interface MaqolasSettings {
  themePresetId: ThemePresetId;
  borderRadiusPresetId: RadiusPresetId;
  customAccentColor: string;
  notificationSoundId: NotificationSoundId;
  aiAssistEnabled: boolean;
  navbarWeatherEnabled: boolean;
}

export const DEFAULT_SETTINGS: MaqolasSettings = {
  themePresetId: "indigo",
  borderRadiusPresetId: "default",
  customAccentColor: "#4f46e5",
  notificationSoundId: "ding",
  aiAssistEnabled: true,
  navbarWeatherEnabled: true,
};

export const SETTINGS_STORAGE_KEY = "maqolas_settings";
