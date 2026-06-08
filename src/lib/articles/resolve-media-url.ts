import { getApiOrigin } from "@/lib/api";

/** Nisbiy yoki to'liq media URL ni canvas/fetch uchun normalizatsiya qilish */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${getApiOrigin()}${trimmed}`;
  }

  return `${getApiOrigin()}/${trimmed}`;
}

export function isAllowedProxyImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const apiOrigin = new URL(getApiOrigin());
    const appOrigin = new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    );

    if (parsed.origin === apiOrigin.origin) return true;
    if (parsed.origin === appOrigin.origin) return true;
    if (parsed.hostname.endsWith("googleusercontent.com")) return true;

    return false;
  } catch {
    return false;
  }
}
