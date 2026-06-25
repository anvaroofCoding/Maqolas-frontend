import { connection } from "next/server";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { MaqolalarTopicLinks } from "@/components/seo/maqolalar-topic-links";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { feedMainClassName } from "@/lib/layout";
import { fetchArticleFeed, fetchCategories } from "@/lib/articles/server";
import {
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildMaqolalarHubJsonLd,
} from "@/lib/seo/json-ld";
import { buildMaqolalarHubDescription } from "@/lib/seo/description";
import { buildMaqolalarHubKeywords } from "@/lib/seo/keywords";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Maqolalar — barcha o'zbekcha maqolalar",
  description: buildMaqolalarHubDescription(),
  path: "/maqolalar",
  keywords: buildMaqolalarHubKeywords(),
});

export default async function MaqolalarHubPage() {
  await connection();
  const [feed, categories] = await Promise.all([
    fetchArticleFeed({ sort: "popular" }),
    fetchCategories(),
  ]);

  return (
    <main className={feedMainClassName}>
      <JsonLdScript
        data={[
          buildMaqolalarHubJsonLd(),
          buildFaqJsonLd(),
          buildItemListJsonLd("Maqolalar", "/maqolalar", feed.articles),
        ]}
      />
      <MaqolalarTopicLinks categories={categories} />
      <ArticleFeedWithPagination
        feed={feed}
        sort="popular"
        title="Ommabop maqolalar"
        emptyMessage="Hozircha maqolalar yo'q. Tez orada yangi kontent paydo bo'ladi."
      />
    </main>
  );
}
