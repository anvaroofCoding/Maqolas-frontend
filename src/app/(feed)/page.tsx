import { connection } from "next/server";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fetchArticleFeed } from "@/lib/articles/server";
import { feedMainClassName } from "@/lib/layout";

export const metadata = buildPageMetadata({
  title: "Siz uchun",
  description:
    "Qiziqishingizga mos va ommabop maqolalar — texnologiya, startaplar, AI va boshqa mavzularda.",
  path: "/",
});

export default async function HomePage() {
  await connection();
  const feed = await fetchArticleFeed({ sort: "popular" });

  return (
    <main className={feedMainClassName}>
      <ArticleFeedWithPagination
        feed={feed}
        sort="popular"
        title="Siz uchun"
        emptyMessage="Hozircha maqolalar yo'q. Tez orada yangi kontent paydo bo'ladi."
      />
    </main>
  );
}
