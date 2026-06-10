import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { feedMainClassName } from "@/lib/layout";
import { fetchArticleFeed, fetchCategories } from "@/lib/articles/server";
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

async function findTopicBySlug(slug: string) {
  const categories = await fetchCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = await findTopicBySlug(slug);

  if (!topic) {
    return buildPageMetadata({
      title: "Mavzu topilmadi",
      path: `/mavzu/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${topic.name} maqolalari`,
    description: buildTopicDescription(topic.name),
    path: `/mavzu/${slug}`,
    keywords: buildTopicKeywords(topic.name, slug),
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  await connection();
  const { slug } = await params;
  const topic = await findTopicBySlug(slug);

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
          buildTopicPageJsonLd(topic.name, slug),
          buildBreadcrumbJsonLd([
            { name: "Bosh sahifa", path: "/" },
            { name: `${topic.name} maqolalari`, path: `/mavzu/${slug}` },
          ]),
          buildItemListJsonLd(
            `${topic.name} maqolalari`,
            `/mavzu/${slug}`,
            feed.articles,
          ),
        ]}
      />
      <ArticleFeedWithPagination
        feed={feed}
        sort="popular"
        category={slug}
        title={`${topic.name} maqolalari`}
        emptyMessage={`${topic.name} bo'yicha hozircha maqolalar yo'q.`}
      />
    </main>
  );
}
