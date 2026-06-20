function normalizeForCompare(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateToWords(text: string, maxWords: number): string {
  const cleaned = text.replace(/…$/u, "").trim();
  if (!cleaned) return "";

  const words = cleaned.split(/\s+/u).filter(Boolean);
  if (words.length <= maxWords) return cleaned;

  return `${words.slice(0, maxWords).join(" ")}…`;
}

/** Kartochka/feed uchun excerpt — sarlavha takrorlanmasin */
export function formatArticleExcerpt(
  title: string,
  excerpt?: string | null,
): string {
  const raw = excerpt?.trim();
  if (!raw) return "";

  const normalizedTitle = normalizeForCompare(title);
  let text = raw;

  if (normalizedTitle && normalizeForCompare(text).startsWith(normalizedTitle)) {
    text = text.slice(title.trim().length).trim();
    text = text.replace(/^[-–—:,.)\]]+\s*/u, "").trim();
  }

  return text || raw;
}

export function hasArticleExcerpt(title: string, excerpt?: string | null): boolean {
  return formatArticleExcerpt(title, excerpt).length > 0;
}
