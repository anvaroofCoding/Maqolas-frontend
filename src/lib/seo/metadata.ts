import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${base}${normalized}`;
}

export function buildPageMetadata(input: PageMetadataInput = {}): Metadata {
  const title = input.title
    ? `${input.title} | ${siteConfig.name}`
    : siteConfig.title;
  const description = input.description ?? siteConfig.description;
  const canonical = absoluteUrl(input.path ?? "");
  const image = absoluteUrl(input.image ?? siteConfig.ogImage);

  return {
    title,
    description,
    keywords: [...(input.keywords ?? siteConfig.keywords)],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const defaultMetadata = buildPageMetadata();
