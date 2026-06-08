import { connection } from "next/server";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchArticleFeed } from "@/lib/articles/server";
import { buildItemListJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { feedMainClassName } from "@/lib/layout";

export const metadata = buildPageMetadata({
  titleFormat: "site",
  description:
    "Maqolas — o'zbekcha maqolalar o'qish va yozish platformasi. Texnologiya, startaplar, AI, marketing va boshqa mavzularda sifatli maqolalar.",
  path: "/",
  keywords: [
    "maqola",
    "maqolalar",
    "o'zbekcha maqolalar",
    "maqola o'qish",
    "eng yaxshi maqolalar",
  ],
});

export default async function HomePage() {
  await connection();
  const feed = await fetchArticleFeed({ sort: "popular" });

  return (
    <main className={feedMainClassName}>
      <JsonLdScript
        data={buildItemListJsonLd(
          "Ommabop o'zbekcha maqolalar",
          "/",
          feed.articles,
        )}
      />
      <ArticleFeedWithPagination
        feed={feed}
        sort="popular"
        title="Siz uchun"
        emptyMessage="Hozircha maqolalar yo'q. Tez orada yangi kontent paydo bo'ladi."
      />
    </main>
  );
}
