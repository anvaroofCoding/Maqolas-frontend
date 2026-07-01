import type {
  ShortcutActionId,
  ShortcutBinding,
  ShortcutOverrides,
} from "@/lib/keyboard-shortcuts/types";
import { SHORTCUTS_STORAGE_KEY } from "@/lib/keyboard-shortcuts/types";
import { bindingToId } from "@/lib/keyboard-shortcuts/format";
import {
  SHORTCUT_DEFINITIONS,
  SHORTCUT_DEFINITION_MAP,
} from "@/lib/keyboard-shortcuts/definitions";

function isValidBinding(value: unknown): value is ShortcutBinding {
  if (!value || typeof value !== "object") return false;
  const binding = value as ShortcutBinding;
  return typeof binding.key === "string" && binding.key.length > 0;
}

export function loadShortcutOverrides(): ShortcutOverrides {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(SHORTCUTS_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as ShortcutOverrides;
    const result: ShortcutOverrides = {};

    for (const [id, binding] of Object.entries(parsed)) {
      if (!(id in SHORTCUT_DEFINITION_MAP)) continue;
      if (!isValidBinding(binding)) continue;
      result[id as ShortcutActionId] = {
        ctrl: Boolean(binding.ctrl),
        meta: Boolean(binding.meta),
        shift: Boolean(binding.shift),
        alt: Boolean(binding.alt),
        key: binding.key.toLowerCase(),
      };
    }

    return result;
  } catch {
    return {};
  }
}

export function saveShortcutOverrides(overrides: ShortcutOverrides) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(overrides));
}

export function getResolvedShortcuts(overrides: ShortcutOverrides) {
  return SHORTCUT_DEFINITIONS.map((definition) => ({
    ...definition,
    binding: overrides[definition.id] ?? definition.defaultBinding,
  }));
}

export function findDuplicateAction(
  actionId: ShortcutActionId,
  binding: ShortcutBinding,
  overrides: ShortcutOverrides,
): ShortcutActionId | null {
  const targetId = bindingToId(binding);

  for (const definition of SHORTCUT_DEFINITIONS) {
    if (definition.id === actionId) continue;
    const resolved = overrides[definition.id] ?? definition.defaultBinding;
    if (bindingToId(resolved) === targetId) {
      return definition.id;
    }
  }

  return null;
}
