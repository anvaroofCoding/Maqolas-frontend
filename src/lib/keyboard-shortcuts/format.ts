import type { ShortcutBinding } from "@/lib/keyboard-shortcuts/types";

function isApplePlatform() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

const KEY_LABELS: Record<string, string> = {
  ",": ",",
  "/": "/",
  " ": "Space",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  escape: "Esc",
};

export function formatShortcut(binding: ShortcutBinding): string {
  const apple = isApplePlatform();
  const parts: string[] = [];

  if (binding.ctrl) parts.push(apple ? "⌃" : "Ctrl");
  if (binding.alt) parts.push(apple ? "⌥" : "Alt");
  if (binding.shift) parts.push(apple ? "⇧" : "Shift");
  if (binding.meta) parts.push(apple ? "⌘" : "Win");

  const keyLabel =
    KEY_LABELS[binding.key] ??
    (binding.key.length === 1 ? binding.key.toUpperCase() : binding.key);

  parts.push(keyLabel);
  return parts.join(apple ? "" : " + ");
}

export function bindingToId(binding: ShortcutBinding): string {
  const parts: string[] = [];
  if (binding.ctrl) parts.push("ctrl");
  if (binding.meta) parts.push("meta");
  if (binding.alt) parts.push("alt");
  if (binding.shift) parts.push("shift");
  parts.push(binding.key.toLowerCase());
  return parts.join("+");
}

export function bindingFromKeyboardEvent(
  event: KeyboardEvent,
): ShortcutBinding | null {
  const key = event.key.toLowerCase();
  if (["control", "shift", "alt", "meta"].includes(key)) {
    return null;
  }

  return {
    ctrl: event.ctrlKey,
    meta: event.metaKey,
    shift: event.shiftKey,
    alt: event.altKey,
    key,
  };
}

export function matchesBinding(
  event: KeyboardEvent,
  binding: ShortcutBinding,
): boolean {
  const key = event.key.toLowerCase();
  return (
    key === binding.key.toLowerCase() &&
    Boolean(event.ctrlKey) === Boolean(binding.ctrl) &&
    Boolean(event.metaKey) === Boolean(binding.meta) &&
    Boolean(event.shiftKey) === Boolean(binding.shift) &&
    Boolean(event.altKey) === Boolean(binding.alt)
  );
}
