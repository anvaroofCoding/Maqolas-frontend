export type ShortcutActionId =
  | "search"
  | "write"
  | "home"
  | "maqolalar"
  | "rasmlar"
  | "yangi"
  | "mavzular"
  | "lenta"
  | "notifications"
  | "settings"
  | "theme-toggle"
  | "random-article"
  | "ai-assistant"
  | "saved-phrases"
  | "profile"
  | "onboarding";

export type ShortcutBinding = {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  key: string;
};

export type ShortcutDefinition = {
  id: ShortcutActionId;
  label: string;
  description: string;
  defaultBinding: ShortcutBinding;
  allowInInput?: boolean;
};

export type ShortcutOverrides = Partial<Record<ShortcutActionId, ShortcutBinding>>;

export const SHORTCUTS_STORAGE_KEY = "maqolas_keyboard_shortcuts";

export const OPEN_SEARCH_EVENT = "maqolas:open-search";
export const OPEN_NOTIFICATIONS_EVENT = "maqolas:open-notifications";
export const OPEN_RANDOM_ARTICLE_EVENT = "maqolas:open-random-article";
