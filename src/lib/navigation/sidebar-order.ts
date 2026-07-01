import type { NavItem } from "@/config/navigation";

export const SIDEBAR_MAIN_ORDER_KEY = "maqolas-sidebar-main-order";
export const SIDEBAR_TOPIC_ORDER_KEY = "maqolas-sidebar-topic-order";

function readOrder(key: string): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

function writeOrder(key: string, order: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(order));
  } catch {
    // ignore quota errors
  }
}

export function applySidebarOrder(
  items: NavItem[],
  order: string[] | null,
): NavItem[] {
  if (!order?.length) return items;

  const byHref = new Map(items.map((item) => [item.href, item]));
  const result: NavItem[] = [];
  const used = new Set<string>();

  for (const href of order) {
    const item = byHref.get(href);
    if (!item) continue;
    result.push(item);
    used.add(href);
  }

  for (const item of items) {
    if (!used.has(item.href)) {
      result.push(item);
    }
  }

  return result;
}

export function loadSidebarMainOrder() {
  return readOrder(SIDEBAR_MAIN_ORDER_KEY);
}

export function loadSidebarTopicOrder() {
  return readOrder(SIDEBAR_TOPIC_ORDER_KEY);
}

export function saveSidebarMainOrder(items: NavItem[]) {
  writeOrder(
    SIDEBAR_MAIN_ORDER_KEY,
    items.map((item) => item.href),
  );
}

export function saveSidebarTopicOrder(items: NavItem[]) {
  writeOrder(
    SIDEBAR_TOPIC_ORDER_KEY,
    items.map((item) => item.href),
  );
}

export function moveSidebarItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
