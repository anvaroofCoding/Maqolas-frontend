export function truncateText(text: string, maxLength = 90) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

export function commentPreviewText(content: string) {
  return truncateText(
    content
      .replace(/^javob berdi\s+@[^\n]+\n?/i, "")
      .trim() || content,
  );
}
