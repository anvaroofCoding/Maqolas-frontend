/**
 * Single source of truth for brand + SEO defaults.
 * Override per-page via `buildPageMetadata()` in @/lib/seo/metadata.
 */
export const siteConfig = {
  name: "Maqolas",
  title: "Maqolas — O'zbekcha maqolalar platformasi",
  description:
    "Maqolas — o'zbekcha maqolalar o'qish va yozish uchun zamonaviy platforma. Texnologiya, startaplar, AI, marketing va boshqa mavzularda sifatli maqolalar.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  host: process.env.NEXT_PUBLIC_SITE_HOST ?? "maqolas.tm2.uz",
  locale: "uz_UZ",
  ogImage: "/opengraph-image",
  twitterHandle: "@maqolas",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  yandexVerification: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
  keywords: [
    "maqola",
    "maqolalar",
    "o'zbekcha maqolalar",
    "maqola o'qish",
    "maqola yozish",
    "bilim platformasi",
    "yangiliklar",
    "o'zbek tili",
    "maqolas",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
