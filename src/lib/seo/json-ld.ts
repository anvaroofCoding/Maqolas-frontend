import type { ArticleCategory, ArticleSummary } from "@/features/articles/types";
import type { UserSocialLinks } from "@/features/auth/types";
import { siteConfig } from "@/config/site";
import { formatSocialHref } from "@/lib/user";
import { absoluteUrl, articleUrl, profileUrl, topicUrl } from "@/lib/seo/urls";

const publisherLogo = absoluteUrl(siteConfig.logoPath);

function buildCreatorPerson() {
  return {
    "@type": "Person" as const,
    name: siteConfig.creator.name,
    jobTitle: siteConfig.creator.role,
    url: siteConfig.creator.telegramUrl,
    sameAs: [siteConfig.creator.telegramUrl],
    description: `${siteConfig.creator.name} — ${siteConfig.name} platformasining yaratuvchisi. ${siteConfig.creator.role}. Telegram: ${siteConfig.creator.telegram}`,
  };
}

export function buildCreatorJsonLd() {
  return {
    "@context": "https://schema.org",
    ...buildCreatorPerson(),
  };
}

export function buildSoftwareApplicationJsonLd() {
  const creator = buildCreatorPerson();

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: siteConfig.htmlLang,
    author: creator,
    creator,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      founder: creator,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
        width: 180,
        height: 180,
      },
    },
  };
}

export function buildOrganizationJsonLd() {
  const creator = buildCreatorPerson();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: [siteConfig.name, siteConfig.host],
    url: siteConfig.url,
    founder: creator,
    logo: {
      "@type": "ImageObject",
      url: publisherLogo,
      width: 180,
      height: 180,
    },
    image: publisherLogo,
    description: siteConfig.description,
    sameAs: [siteConfig.creator.telegramUrl],
  };
}

export function buildWebSiteJsonLd() {
  const creator = buildCreatorPerson();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: [siteConfig.name, siteConfig.host],
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.htmlLang,
    author: creator,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      founder: creator,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
        width: 180,
        height: 180,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url.replace(/\/$/, "")}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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
        width: 180,
        height: 180,
      },
    },
    articleSection: input.categories?.[0]?.name,
    keywords: input.categories?.map((category) => category.name).join(", "),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    inLanguage: siteConfig.htmlLang,
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
  followersCount?: number;
  social?: UserSocialLinks;
  articles?: Array<{ title: string; slug: string }>;
}) {
  const url = profileUrl(input.username);
  const sameAs = collectProfileSameAs(input.social);
  const interactionStatistic = [];

  if (input.followersCount && input.followersCount > 0) {
    interactionStatistic.push({
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/FollowAction",
      userInteractionCount: input.followersCount,
    });
  }

  if (input.articlesCount && input.articlesCount > 0) {
    interactionStatistic.push({
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WriteAction",
      userInteractionCount: input.articlesCount,
    });
  }

  const mainEntity: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${url}#person`,
    name: input.displayName,
    alternateName: [`@${input.username}`, input.username],
    identifier: {
      "@type": "PropertyValue",
      propertyID: "username",
      value: input.username,
    },
    url,
    description: input.bio,
    image: input.avatarUrl ? absoluteUrl(input.avatarUrl) : undefined,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(interactionStatistic.length > 0 ? { interactionStatistic } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: `${input.displayName} | Muallif`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    mainEntity,
    ...(input.articles && input.articles.length > 0
      ? {
          hasPart: {
            "@type": "ItemList",
            name: `${input.displayName} maqolalari`,
            numberOfItems: input.articles.length,
            itemListElement: input.articles.slice(0, 10).map((article, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: article.title,
              url: articleUrl(article.slug),
            })),
          },
        }
      : {}),
  };
}

function collectProfileSameAs(social?: UserSocialLinks): string[] {
  if (!social) return [];

  const links = [
    formatSocialHref("website", social.website),
    formatSocialHref("linkedin", social.linkedin),
    formatSocialHref("telegram", social.telegram),
    formatSocialHref("instagram", social.instagram),
  ].filter((href): href is string => Boolean(href));

  return [...new Set(links)];
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
    description: `${topicLabel} bo'yicha o'zbekcha maqolalar — Maqolas platformasida o'qing yoki maqolalaringizni yozing.`,
    url: topicUrl(slug),
    inLanguage: siteConfig.htmlLang,
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
