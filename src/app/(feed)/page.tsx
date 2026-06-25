import { connection } from "next/server";
import { HomepageFeedWithPagination } from "@/components/articles/homepage-feed-with-pagination";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchArticleFeed, fetchHomepageLayout } from "@/lib/articles/server";
import { buildHomepageDescription } from "@/lib/seo/description";
import { buildFaqJsonLd, buildItemListJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { coreMaqolaKeywords } from "@/lib/seo/core-keywords";
import { feedMainClassName } from "@/lib/layout";

export const metadata = buildPageMetadata({
  titleFormat: "site",
  description: buildHomepageDescription(),
  path: "/",
  keywords: [...coreMaqolaKeywords],
});

export default async function HomePage() {
  await connection();
  const [homepage, latestFeed] = await Promise.all([
    fetchHomepageLayout(),
    fetchArticleFeed({ sort: "newest", limit: 12 }),
  ]);

  return (
    <main className={feedMainClassName}>
      <JsonLdScript
        data={[
          buildItemListJsonLd(
            "Ommabop o'zbekcha maqolalar",
            "/",
            homepage.feed.articles,
          ),
          buildFaqJsonLd(),
        ]}
      />
      <HomepageFeedWithPagination
        layoutData={homepage}
        latestArticles={latestFeed.articles}
        sort={homepage.algorithm}
        title="Siz uchun"
        emptyMessage="Hozircha maqolalar yo'q. Tez orada yangi kontent paydo bo'ladi."
      />
    </main>
  );
}
