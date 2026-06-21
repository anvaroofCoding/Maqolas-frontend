import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl, resolveOgImageUrl } from "@/lib/seo/urls";

export type TitleFormat = "site" | "page" | "article" | "profile";

export type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  titleFormat?: TitleFormat;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
};

function resolveTitle(input: PageMetadataInput): string {
  const format = input.titleFormat ?? "page";

  switch (format) {
    case "site":
      return siteConfig.title;
    case "article":
      return input.title
        ? `${input.title} — Maqola | O'zbekcha maqolalar`
        : siteConfig.title;
    case "profile":
      return input.title
        ? `${input.title} | Muallif — ${siteConfig.name}`
        : siteConfig.title;
    case "page":
    default:
      return input.title
        ? `${input.title} | ${siteConfig.name}`
        : siteConfig.title;
  }
}

export function buildPageMetadata(input: PageMetadataInput = {}): Metadata {
  const title = resolveTitle(input);
  const description = input.description ?? siteConfig.description;
  const canonical = absoluteUrl(input.path ?? "");
  const image = input.image
    ? (resolveOgImageUrl(input.image) ?? absoluteUrl(input.image))
    : absoluteUrl(siteConfig.ogImage);
  const logoUrl = absoluteUrl(siteConfig.logoPath);
  const keywords = dedupeKeywords([
    ...(input.keywords ?? []),
    ...siteConfig.keywords,
  ]);

  const verification: Metadata["verification"] = {};
  if (siteConfig.googleSiteVerification) {
    verification.google = siteConfig.googleSiteVerification;
  }
  if (siteConfig.yandexVerification) {
    verification.yandex = siteConfig.yandexVerification;
  }

  const openGraph: Metadata["openGraph"] =
    input.type === "article"
      ? {
          type: "article",
          locale: siteConfig.locale,
          url: canonical,
          siteName: siteConfig.name,
          title,
          description,
          images: [{ url: image, width: 1200, height: 630, alt: title }],
          publishedTime: input.publishedTime,
          modifiedTime: input.modifiedTime,
          authors: input.authors,
          tags: input.tags,
        }
      : {
          type: "website",
          locale: siteConfig.locale,
          url: canonical,
          siteName: siteConfig.name,
          title,
          description,
          images: [{ url: image, width: 1200, height: 630, alt: title }],
        };

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    authors: [
      {
        name: siteConfig.creator.name,
        url: siteConfig.creator.telegramUrl,
      },
    ],
    creator: siteConfig.creator.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icon", type: "image/png", sizes: "48x48" },
        { url: logoUrl, type: "image/png", sizes: "180x180" },
      ],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
      shortcut: "/icon",
    },
    alternates: {
      canonical,
      types: {
        "application/rss+xml": absoluteUrl("/feed.xml"),
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

function dedupeKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(keyword.trim());
  }

  return result;
}

export const defaultMetadata = buildPageMetadata({
  titleFormat: "site",
});
