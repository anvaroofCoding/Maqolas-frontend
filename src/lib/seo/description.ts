import type { ArticleCategory } from "@/features/articles/types";

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

  return `${authorPart}${categoryPart}o'zbekcha maqola: ${title}. Maqolas — maqolalar platformasida o'qing, baham ko'ring va fikr bildiring.`;
}

export function buildTopicDescription(topicLabel: string): string {
  return `${topicLabel} bo'yicha eng yaxshi o'zbekcha maqolalar, tahlillar va fikrlar. Maqolas platformasida ${topicLabel.toLowerCase()} mavzusidagi maqolalarni o'qing.`;
}

export function buildProfileDescription(
  displayName: string,
  bio?: string,
  articlesCount?: number,
): string {
  const trimmedBio = bio?.trim();
  if (trimmedBio) {
    return trimmedBio;
  }

  const countPart =
    articlesCount && articlesCount > 0
      ? `${articlesCount} ta nashr etilgan maqola. `
      : "";

  return `${countPart}${displayName} — Maqolas platformasidagi muallif profili. O'zbekcha maqolalar, fikrlar va bilimlar.`;
}
