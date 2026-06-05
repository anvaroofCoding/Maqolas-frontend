import { connection } from "next/server";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { feedMainClassName } from "@/lib/layout";
import { fetchArticleFeed } from "@/lib/articles/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";
import { topicNavItems } from "@/config/navigation";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = topicNavItems.find((item) => item.href === `/mavzu/${slug}`);

  return buildPageMetadata({
    title: topic ? `${topic.label} maqolalari` : "Mavzu",
    path: `/mavzu/${slug}`,
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
