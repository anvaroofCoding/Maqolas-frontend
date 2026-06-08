import { connection } from "next/server";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { feedMainClassName } from "@/lib/layout";
import { fetchArticleFeed } from "@/lib/articles/server";
import { buildItemListJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Yangi maqolalar",
  description:
    "Eng so'nggi nashr etilgan o'zbekcha maqolalar va yangiliklar. Maqolas platformasida har kuni yangi maqolalar.",
  path: "/yangi",
  keywords: [
    "yangi maqolalar",
    "so'nggi maqolalar",
    "maqola",
    "maqolalar",
    "o'zbekcha yangiliklar",
  ],
});

export default async function NewArticlesPage() {
  await connection();
  const feed = await fetchArticleFeed({ sort: "newest" });

  return (
    <main className={feedMainClassName}>
      <JsonLdScript
        data={buildItemListJsonLd("Yangi maqolalar", "/yangi", feed.articles)}
      />
      <ArticleFeedWithPagination
        feed={feed}
        sort="newest"
        title="Yangi maqolalar"
        emptyMessage="Hozircha yangi maqolalar yo'q."
      />
    </main>
  );
}
