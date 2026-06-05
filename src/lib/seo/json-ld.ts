import { siteConfig } from "@/config/site";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}

type ArticleJsonLdInput = {
  title: string;
  description: string;
  slug: string;
  coverImageUrl?: string;
  authorName: string;
  publishedAt?: string;
  updatedAt?: string;
};

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const url = `${siteConfig.url.replace(/\/$/, "")}/maqola/${input.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    image: input.coverImageUrl
      ? [input.coverImageUrl]
      : [`${siteConfig.url}${siteConfig.ogImage}`],
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    inLanguage: siteConfig.locale,
  };
}
