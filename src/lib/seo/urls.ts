import { siteConfig } from "@/config/site";
import { resolveMediaUrl } from "@/lib/articles/resolve-media-url";

/** Nisbiy yoki to'liq URL ni canonical/OG uchun mutlaq qilish */
export function absoluteUrl(path = ""): string {
  if (!path) {
    return siteConfig.url.replace(/\/$/, "");
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function articleUrl(slug: string): string {
  return absoluteUrl(`/maqola/${slug}`);
}

export function topicUrl(slug: string): string {
  return absoluteUrl(`/mavzu/${slug}`);
}

export function profileUrl(username: string): string {
  return absoluteUrl(`/profil/${username}`);
}

/** Maqola muqovasi yoki boshqa media URL ni Telegram/OG uchun mutlaq qilish */
export function resolveOgImageUrl(url?: string | null): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return resolveMediaUrl(trimmed) ?? absoluteUrl(trimmed);
}

export function articleOgImageUrl(slug: string, coverImageUrl?: string | null): string {
  return (
    resolveOgImageUrl(coverImageUrl) ??
    absoluteUrl(`/maqola/${slug}/opengraph-image`)
  );
}
