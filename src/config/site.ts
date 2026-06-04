/**
 * Single source of truth for brand + SEO defaults.
 * Override per-page via `buildPageMetadata()` in @/lib/seo/metadata.
 */
export const siteConfig = {
  name: "Maqolas",
  title: "Maqolas — Maqolalar platformasi",
  description:
    "Maqolalar, yangiliklar va bilimlar uchun zamonaviy o‘zbek platformasi.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "uz",
  ogImage: "/og-default.png",
  twitterHandle: "@maqolas",
  keywords: [
    "maqolalar",
    "yangiliklar",
    "o‘zbek tili",
    "bilim",
    "maqolas",
  ] as const,
} as const;

export type SiteConfig = typeof siteConfig;
