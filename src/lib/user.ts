import { buildProxyImageUrl, resolveMediaUrl } from "@/lib/articles/resolve-media-url";

export function getUserInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const EXTERNAL_AVATAR_HOSTS = ["googleusercontent.com", "ggpht.com"];

function isExternalAvatarHost(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return EXTERNAL_AVATAR_HOSTS.some((host) => hostname.includes(host));
  } catch {
    return false;
  }
}

/** Google va boshqa tashqi avatar URL larini ko'rsatish uchun normalizatsiya */
export function resolveAvatarUrl(url?: string | null): string | undefined {
  const resolved = resolveMediaUrl(url);
  if (!resolved) return undefined;

  if (isExternalAvatarHost(resolved)) {
    return buildProxyImageUrl(resolved);
  }

  return resolved;
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
