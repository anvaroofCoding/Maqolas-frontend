import type { ArticleCategory } from "@/features/articles/types";
import { siteConfig } from "@/config/site";

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
    ...categoryKeywords,
    ...authorKeywords,
    ...siteConfig.keywords,
  ]);
}

export function buildTopicKeywords(topicLabel: string, slug: string): string[] {
  return dedupeKeywords([
    `${topicLabel} maqolalari`,
    `${topicLabel} bo'yicha maqola`,
    topicLabel,
    slug,
    "maqola",
    "maqolalar",
    "o'zbekcha maqolalar",
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
