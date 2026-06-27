import type { ArticleCategory, ArticleSummary } from "@/features/articles/types";
import type { UserSocialLinks } from "@/features/auth/types";
import { primarySeoNavLinks } from "@/config/seo-navigation";
import { siteConfig } from "@/config/site";
import { extractProfileTagline } from "@/lib/seo/profile";
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

const siteOrigin = siteConfig.url.replace(/\/$/, "");
const organizationId = `${siteOrigin}/#organization`;
const websiteId = `${siteOrigin}/#website`;

/** Google Search "site name" uchun Organization + WebSite bir @graph da. */
export function buildSiteIdentityJsonLd() {
  const creator = buildCreatorPerson();
  const homeUrl = `${siteOrigin}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        alternateName: ["Maqolalar", "O'zbekcha maqolalar", siteConfig.host],
        url: homeUrl,
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
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        alternateName: [
          "Maqolalar",
          "Maqola",
          "O'zbekcha maqolalar",
          siteConfig.host,
        ],
        url: homeUrl,
        description: siteConfig.description,
        inLanguage: siteConfig.htmlLang,
        image: publisherLogo,
        publisher: { "@id": organizationId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteOrigin}/maqolalar?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function buildOrganizationJsonLd() {
  const creator = buildCreatorPerson();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    alternateName: ["Maqolalar", "O'zbekcha maqolalar", siteConfig.host],
    url: `${siteOrigin}/`,
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

export function buildSiteNavigationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${siteConfig.url.replace(/\/$/, "")}/#main-navigation`,
    name: `${siteConfig.name} asosiy menyu`,
    isPartOf: { "@id": websiteId },
    hasPart: primarySeoNavLinks.map((link) => ({
      "@type": "WebPage",
      name: link.label,
      description: link.description,
      url: absoluteUrl(link.href),
    })),
  };
}

export function buildWebSiteJsonLd() {
  return buildSiteIdentityJsonLd();
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
  const tagline = extractProfileTagline(input.bio);
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
    ...(tagline ? { jobTitle: tagline } : {}),
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
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
    description: `${topicLabel} bo'yicha o'zbekcha maqolalar — maqola o'qish va yozish uchun Maqolas platformasi.`,
    url: topicUrl(slug),
    inLanguage: siteConfig.htmlLang,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Thing",
      name: `${topicLabel} maqolalari`,
    },
  };
}

const FAQ_ENTRIES = [
  {
    question: "Maqolalar qayerda o'qish mumkin?",
    answer:
      "Maqolas platformasida minglab o'zbekcha maqolalar mavjud. Bosh sahifada ommabop maqolalar, /maqolalar sahifasida barcha mavzular va /yangi sahifasida eng so'nggi maqolalarni topasiz.",
  },
  {
    question: "O'zbekcha maqola qanday yoziladi?",
    answer:
      "Maqolas ga ro'yxatdan o'ting, «Maqola yozish» tugmasini bosing va matningizni yozing. Maqolangiz moderatsiyadan o'tgach nashr etiladi va qidiruv tizimlarida ko'rinadi.",
  },
  {
    question: "Maqola va maqolalar farqi nima?",
    answer:
      "Maqola — bitta maqola (insho, tahlil, fikr). Maqolalar — bir nechta maqolalar to'plami. Maqolas ikkala holatda ham o'zbekcha kontent o'qish va yozish uchun xizmat qiladi.",
  },
  {
    question: "Qaysi mavzularda maqolalar bor?",
    answer:
      "Texnologiya, startaplar, sun'iy intellekt, marketing, ta'lim va boshqa ko'plab mavzularda maqolalar mavjud. /mavzular sahifasidan barcha mavzularni ko'rishingiz mumkin.",
  },
] as const;

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ENTRIES.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function buildYangiPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Yangi maqolalar",
    description:
      "Eng so'nggi nashr etilgan o'zbekcha maqolalar va yangi kontent — Maqolas.",
    url: absoluteUrl("/yangi"),
    inLanguage: siteConfig.htmlLang,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildMavzularPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Maqola mavzulari",
    description:
      "Texnologiya, startaplar, AI, marketing va boshqa mavzularda o'zbekcha maqolalar.",
    url: absoluteUrl("/mavzular"),
    inLanguage: siteConfig.htmlLang,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildMaqolalarHubJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Maqolalar — o'zbekcha maqolalar",
    description:
      "Barcha mavzulardagi o'zbekcha maqolalar katalogi. Maqola o'qish va yozish uchun Maqolas platformasi.",
    url: absoluteUrl("/maqolalar"),
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
