import { normalizeHashtag } from "@/lib/hashtags/normalize-hashtag";

const STORAGE_KEY = "maqolas-recent-hashtags";
const MAX_RECENT = 30;

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeRecent(tags: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  } catch {
    // ignore quota errors
  }
}

export function getRecentHashtags(): string[] {
  return readRecent();
}

export function rememberHashtags(tags: string[]) {
  const normalized = tags
    .map((tag) => normalizeHashtag(tag))
    .filter((tag): tag is string => Boolean(tag));

  if (!normalized.length) return;

  const merged = [...normalized, ...readRecent()];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of merged) {
    if (seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
    if (result.length >= MAX_RECENT) break;
  }

  writeRecent(result);
}

export function mergeHashtagSuggestions(
  ...sources: Array<string[] | undefined>
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const source of sources) {
    for (const raw of source ?? []) {
      const tag = normalizeHashtag(raw);
      if (!tag || seen.has(tag)) continue;
      seen.add(tag);
      result.push(tag);
    }
  }

  return result;
}
