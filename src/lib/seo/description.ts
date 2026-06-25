import type { ArticleCategory } from "@/features/articles/types";
import { siteConfig } from "@/config/site";
import { formatCount } from "@/lib/format";

/** Bosh sahifa meta description — "maqolalar" qidiruv niyatiga mos */
export function buildHomepageDescription(): string {
  return "Maqolalar va o'zbekcha maqolalar o'qish uchun eng yaxshi joy. Maqola yozish, turli mavzularda maqolalarni topish va o'z fikrlaringizni nashr etish — barchasi Maqolas platformasida bepul.";
}

/** /maqolalar hub sahifasi uchun alohida description */
export function buildMaqolalarHubDescription(): string {
  return "Barcha o'zbekcha maqolalar bir joyda: texnologiya, startap, AI, marketing va boshqa mavzularda maqolalar. Maqola o'qish yoki yangi maqola yozish uchun Maqolas ga kiring.";
}

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
  return `${topicLabel} maqolalari — o'zbekcha maqolalar, tahlillar va fikrlar. ${topicLabel} bo'yicha maqola o'qish yoki o'z maqolangizni yozish uchun Maqolas platformasiga kiring.`;
}

export function buildProfileDescription(
  displayName: string,
  bio?: string,
  articlesCount?: number,
  followersCount?: number,
  username?: string,
): string {
  const statsParts: string[] = [];

  if (typeof articlesCount === "number" && articlesCount > 0) {
    statsParts.push(`${formatCount(articlesCount)} ta maqola`);
  }

  if (typeof followersCount === "number" && followersCount > 0) {
    statsParts.push(`${formatCount(followersCount)} obunachi`);
  }

  const statsLine = statsParts.length > 0 ? statsParts.join(" · ") : "";
  const handlePart = username ? `@${username}` : "";
  const trimmedBio = bio?.trim();
  const lead = [statsLine, handlePart].filter(Boolean).join(" · ");

  if (trimmedBio) {
    const bioShort =
      trimmedBio.length > 150
        ? `${trimmedBio.slice(0, 147).trimEnd()}…`
        : trimmedBio;

    if (lead) {
      return `${lead} — ${bioShort}. ${displayName} profili Maqolas da.`;
    }

    return `${bioShort}. ${displayName} — Maqolas muallifi.`;
  }

  if (lead) {
    return `${lead}. ${displayName} — Maqolas platformasidagi muallif. Profil va maqolalarni ko'ring.`;
  }

  const handleSuffix = username ? ` (@${username})` : "";
  return `${displayName}${handleSuffix} — Maqolas platformasidagi muallif. O'zbekcha maqolalar, fikrlar va bilimlar.`;
}
