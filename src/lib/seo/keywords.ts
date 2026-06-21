import type { ArticleCategory } from "@/features/articles/types";
import { siteConfig } from "@/config/site";
import { coreMaqolaKeywords } from "@/lib/seo/core-keywords";

export function buildArticleKeywords(
  title: string,
  categories?: ArticleCategory[],
  authorName?: string,
): string[] {
  const categoryKeywords =
    categories?.flatMap((category) => [
      category.name,
      `${category.name} maqolalari`,
      `${category.name} bo'yicha maqola`,
    ]) ?? [];

  const authorKeywords = authorName
    ? [`${authorName} maqolalari`, authorName]
    : [];

  return dedupeKeywords([
    title,
    "maqola",
    "maqolalar",
    "o'zbekcha maqola",
    "uzbek maqola",
    ...categoryKeywords,
    ...authorKeywords,
    ...coreMaqolaKeywords,
    ...siteConfig.keywords,
  ]);
}

export function buildTopicKeywords(topicLabel: string, slug: string): string[] {
  return dedupeKeywords([
    `${topicLabel} maqolalari`,
    `${topicLabel} bo'yicha maqola`,
    `${topicLabel} maqolasi`,
    `${topicLabel} haqida maqola`,
    topicLabel,
    slug,
    ...coreMaqolaKeywords,
    ...siteConfig.keywords,
  ]);
}

export function buildMaqolalarHubKeywords(): string[] {
  return dedupeKeywords([
    "maqolalar",
    "barcha maqolalar",
    "maqolalar ro'yxati",
    "maqolalar katalogi",
    ...coreMaqolaKeywords,
    ...siteConfig.keywords,
  ]);
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

export function buildProfileKeywords(
  displayName: string,
  username: string,
  bio?: string,
): string[] {
  const nameParts = displayName.split(/\s+/).filter(Boolean);

  return dedupeKeywords([
    displayName,
    ...nameParts,
    `@${username}`,
    username,
    `${displayName} maqolalari`,
    `${displayName} Maqolas`,
    `${displayName} muallif`,
    "muallif",
    "maqola",
    "maqolalar",
    "o'zbekcha maqolalar",
    ...(bio ? [bio.slice(0, 80)] : []),
    ...siteConfig.keywords,
  ]);
}
