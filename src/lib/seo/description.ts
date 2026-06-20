import type { ArticleCategory } from "@/features/articles/types";
import { siteConfig } from "@/config/site";

type ArticleDescriptionInput = {
  title: string;
  excerpt?: string;
  categories?: ArticleCategory[];
  authorName?: string;
};

export function buildArticleDescription({
  title,
  excerpt,
  categories,
  authorName,
}: ArticleDescriptionInput): string {
  const trimmedExcerpt = excerpt?.trim();
  if (trimmedExcerpt) {
    return trimmedExcerpt;
  }

  const categoryNames = categories?.map((category) => category.name).filter(Boolean);
  const categoryPart =
    categoryNames && categoryNames.length > 0
      ? `${categoryNames.join(", ")} bo'yicha `
      : "";

  const authorPart = authorName ? `${authorName} tomonidan ` : "";

  return `${authorPart}${categoryPart}o'zbekcha maqola: ${title}. Maqolas platformasida o'qing yoki o'z maqolalaringizni yozing.`;
}

export function buildTopicDescription(topicLabel: string): string {
  return `${topicLabel} bo'yicha eng yaxshi o'zbekcha maqolalar, tahlillar va fikrlar. Maqolas platformasida o'qing yoki ${topicLabel.toLowerCase()} mavzusida maqolalaringizni yozing.`;
}

export function buildProfileDescription(
  displayName: string,
  bio?: string,
  articlesCount?: number,
  followersCount?: number,
  username?: string,
): string {
  const statsParts: string[] = [];

  if (articlesCount && articlesCount > 0) {
    statsParts.push(`${articlesCount} ta maqola`);
  }

  if (followersCount && followersCount > 0) {
    statsParts.push(`${followersCount} ta obunachi`);
  }

  const statsLine = statsParts.length > 0 ? `${statsParts.join(" · ")}. ` : "";
  const handlePart = username ? `@${username}. ` : "";
  const trimmedBio = bio?.trim();

  if (trimmedBio) {
    const combined = `${statsLine}${trimmedBio}`;
    if (combined.length <= 320) {
      return combined;
    }

    const budget = Math.max(120, 300 - statsLine.length);
    return `${statsLine}${trimmedBio.slice(0, budget).trimEnd()}…`;
  }

  return `${statsLine}${handlePart}${displayName} — Maqolas platformasidagi muallif. O'zbekcha maqolalar, fikrlar va bilimlar.`;
}
