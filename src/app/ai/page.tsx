import { AiArticlePageClient } from "@/components/ai-article/ai-article-page-client";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "AI maqola yordamchisi | Maqolas",
  description:
    "Sun'iy intellekt yordamida o'zbekcha maqola yozish. Talabingizni kiriting — AI siz uchun maqola tayyorlaydi.",
  path: "/ai",
  keywords: ["AI maqola", "sun'iy intellekt", "maqola yozish", "Maqolas AI"],
});

export default function AiArticlePage() {
  return <AiArticlePageClient />;
}
