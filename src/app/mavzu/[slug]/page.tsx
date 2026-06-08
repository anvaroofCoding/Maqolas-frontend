import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { topicNavItems } from "@/config/navigation";
import { feedMainClassName } from "@/lib/layout";
import { fetchArticleFeed } from "@/lib/articles/server";
import { buildTopicDescription } from "@/lib/seo/description";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildTopicPageJsonLd,
} from "@/lib/seo/json-ld";
import { buildTopicKeywords } from "@/lib/seo/keywords";
import { buildPageMetadata } from "@/lib/seo/metadata";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = topicNavItems.find((item) => item.href === `/mavzu/${slug}`);

  if (!topic) {
    return buildPageMetadata({
      title: "Mavzu topilmadi",
      path: `/mavzu/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${topic.label} maqolalari`,
    description: buildTopicDescription(topic.label),
    path: `/mavzu/${slug}`,
    keywords: buildTopicKeywords(topic.label, slug),
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  await connection();
  const { slug } = await params;
  const topic = topicNavItems.find((item) => item.href === `/mavzu/${slug}`);

  if (!topic) {
    notFound();
  }

  const feed = await fetchArticleFeed({
    sort: "popular",
    category: slug,
  });

  return (
    <main className={feedMainClassName}>
      <JsonLdScript
        data={[
          buildTopicPageJsonLd(topic.label, slug),
          buildBreadcrumbJsonLd([
            { name: "Bosh sahifa", path: "/" },
            { name: `${topic.label} maqolalari`, path: `/mavzu/${slug}` },
          ]),
          buildItemListJsonLd(
            `${topic.label} maqolalari`,
            `/mavzu/${slug}`,
            feed.articles,
          ),
        ]}
      />
      <ArticleFeedWithPagination
        feed={feed}
        sort="popular"
        category={slug}
        title={`${topic.label} maqolalari`}
        emptyMessage={`${topic.label} bo'yicha hozircha maqolalar yo'q.`}
      />
    </main>
  );
}
