/** Bio birinchi qatorini Google/Instagram uslubidagi title uchun */
export function extractProfileTagline(bio?: string): string | undefined {
  const trimmed = bio?.trim();
  if (!trimmed) return undefined;

  const firstLine = trimmed.split(/\n/)[0]?.trim();
  if (!firstLine) return undefined;

  return firstLine.length > 72
    ? `${firstLine.slice(0, 69).trimEnd()}…`
    : firstLine;
}

export function splitDisplayName(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] ?? displayName,
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
}
