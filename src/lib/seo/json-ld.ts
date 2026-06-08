import type { ArticleCategory, ArticleSummary } from "@/features/articles/types";
import { siteConfig } from "@/config/site";
import { absoluteUrl, articleUrl, profileUrl, topicUrl } from "@/lib/seo/urls";

const publisherLogo = absoluteUrl(siteConfig.ogImage);

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: publisherLogo,
    description: siteConfig.description,
    sameAs: [],
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "uz",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: publisherLogo,
    },
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
  authorUsername?: string;
  publishedAt?: string;
  updatedAt?: string;
  categories?: ArticleCategory[];
  wordCount?: number;
};

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const url = articleUrl(input.slug);
  const image = input.coverImageUrl
    ? absoluteUrl(input.coverImageUrl)
    : publisherLogo;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: [image],
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorUsername
        ? { url: profileUrl(input.authorUsername) }
        : {}),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    articleSection: input.categories?.[0]?.name,
    keywords: input.categories?.map((category) => category.name).join(", "),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    inLanguage: "uz",
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildPersonJsonLd(input: {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  articlesCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: input.displayName,
      url: profileUrl(input.username),
      description: input.bio,
      image: input.avatarUrl ? absoluteUrl(input.avatarUrl) : undefined,
      ...(input.articlesCount
        ? {
            agentInteractionStatistic: {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/WriteAction",
              userInteractionCount: input.articlesCount,
            },
          }
        : {}),
    },
  };
}

export function buildItemListJsonLd(
  name: string,
  path: string,
  articles: ArticleSummary[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: articles.length,
    itemListElement: articles.slice(0, 10).map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: articleUrl(article.slug),
      name: article.title,
    })),
  };
}

export function buildTopicPageJsonLd(topicLabel: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topicLabel} maqolalari`,
    description: `${topicLabel} bo'yicha o'zbekcha maqolalar`,
    url: topicUrl(slug),
    inLanguage: "uz",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function estimateWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}
