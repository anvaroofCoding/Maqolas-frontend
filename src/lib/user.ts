export function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatSocialHref(
  kind: "website" | "linkedin" | "telegram" | "instagram",
  value?: string,
) {
  if (!value?.trim()) return null;
  const v = value.trim();
  if (v.startsWith("http://") || v.startsWith("https://")) return v;

  switch (kind) {
    case "telegram":
      return v.startsWith("@") ? `https://t.me/${v.slice(1)}` : `https://t.me/${v}`;
    case "instagram":
      return v.startsWith("@")
        ? `https://instagram.com/${v.slice(1)}`
        : `https://instagram.com/${v}`;
    case "linkedin":
      return `https://linkedin.com/in/${v}`;
    default:
      return `https://${v}`;
  }
}
