/**
 * Single source of truth for brand + SEO defaults.
 * Override per-page via `buildPageMetadata()` in @/lib/seo/metadata.
 */
export const siteConfig = {
  name: "Maqolas",
  title: "Maqolas — O'zbekcha maqolalar platformasi",
  tagline: "Maqolas platformasida maqolalaringizni yozing",
  description:
    "Maqolas platformasida maqolalaringizni yozing. O'zbekcha maqolalar o'qish va nashr etish uchun zamonaviy platforma. Yaratuvchi: Islomjon Anvarov (Full stack developer). Telegram: @rivoqchi.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  host: process.env.NEXT_PUBLIC_SITE_HOST ?? "maqolas.tm2.uz",
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
    "maqola o'qish",
    "maqola yozish",
    "maqolas platformasida maqolalaringizni yozing",
    "maqolas platformasi",
    "Islomjon Anvarov",
    "Maqolas yaratuvchisi",
    "rivoqchi",
    "bilim platformasi",
    "yangiliklar",
    "o'zbek tili",
    "maqolas",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
