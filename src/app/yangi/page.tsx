import { connection } from "next/server";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { feedMainClassName } from "@/lib/layout";
import { fetchArticleFeed } from "@/lib/articles/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Yangi maqolalar",
  description: "Eng so'nggi nashr etilgan maqolalar va yangiliklar.",
  path: "/yangi",
});

export default async function NewArticlesPage() {
  await connection();
  const feed = await fetchArticleFeed({ sort: "newest" });

  return (
    <main className={feedMainClassName}>
      <ArticleFeedWithPagination
        feed={feed}
        sort="newest"
        title="Yangi maqolalar"
        emptyMessage="Hozircha yangi maqolalar yo'q."
      />
    </main>
  );
}
