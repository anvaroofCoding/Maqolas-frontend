import { Suspense } from "react";
import { ArticleFeedPageClient } from "@/components/articles/article-feed-page-client";
import { YangiFeedJsonLd } from "@/components/seo/yangi-feed-json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Yangi maqolalar",
  description:
    "Eng so'nggi nashr etilgan o'zbekcha maqolalar va yangiliklar. Maqolas platformasida o'qing yoki maqolalaringizni yozing.",
  path: "/yangi",
  keywords: [
    "yangi maqolalar",
    "so'nggi maqolalar",
    "maqola",
    "maqolalar",
    "o'zbekcha yangiliklar",
  ],
});

export default function NewArticlesPage() {
  return (
    <>
      <Suspense fallback={null}>
        <YangiFeedJsonLd />
      </Suspense>
      <ArticleFeedPageClient
        sort="newest"
        title="Yangi maqolalar"
        emptyMessage="Hozircha yangi maqolalar yo'q."
      />
    </>
  );
}
