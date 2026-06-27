/**
 * Single source of truth for brand + SEO defaults.
 * Override per-page via `buildPageMetadata()` in @/lib/seo/metadata.
 */
const productionSiteUrl = "https://maqolas.tm2.uz";

/** Canonical origin — Google site name uchun JSON-LD `url` shu manzil bilan mos bo'lishi shart. */
export function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  return process.env.NODE_ENV === "production"
    ? productionSiteUrl
    : "http://localhost:3000";
}

export const siteConfig = {
  name: "Maqolas",
  title: "Maqolalar — O'zbekcha maqolalar o'qish va yozish | Maqolas",
  tagline: "O'zbekcha maqolalar — o'qing, yozing, ulashing",
  description:
    "Maqolalar va o'zbekcha maqolalar uchun №1 platforma. Maqola o'qish, maqola yozish va turli mavzularda maqolalarni bepul toping. Texnologiya, startap, AI va boshqa mavzularda eng yaxshi maqolalar — Maqolas.",
  url: resolveSiteUrl(),
  host: (process.env.NEXT_PUBLIC_SITE_HOST ?? "maqolas.tm2.uz").toLowerCase(),
  /** HTML lang atributi (BCP 47) */
  htmlLang: "uz",
  /** Open Graph locale */
  locale: "uz_UZ",
  ogImage: "/opengraph-image",
  /** Google Organization schema va manifest uchun (180×180) */
  logoPath: "/apple-icon",
  twitterHandle: "@maqolas",
  creator: {
    name: "Islomjon Anvarov",
    role: "Full stack developer",
    telegram: "@rivoqchi",
    telegramUrl: "https://t.me/rivoqchi",
  },
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
  keywords: [
    "maqola",
    "maqolalar",
    "o'zbekcha maqolalar",
    "uzbek maqolalar",
    "uzbekcha maqolalar",
    "maqola o'qish",
    "maqola yozish",
    "maqola platformasi",
    "eng yaxshi maqolalar",
    "maqola mavzulari",
    "maqolas platformasi",
    "bilim maqolalari",
    "o'zbek tili maqolalari",
    "yangi maqolalar",
    "maqolas",
    "Islomjon Anvarov",
    "rivoqchi",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
