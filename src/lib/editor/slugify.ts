export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\u0400-\u04FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "section";
}
