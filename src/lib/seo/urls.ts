import { siteConfig } from "@/config/site";

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
