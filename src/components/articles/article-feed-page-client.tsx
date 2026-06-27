"use client";

import { notFound } from "next/navigation";
import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { useTopicNavItems } from "@/components/layout/use-topic-nav-items";
import { MaqolalarTopicLinksClient } from "@/components/seo/maqolalar-topic-links-client";
import { useListArticlesQuery } from "@/features/articles/api/articles-api";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";
import { feedMainClassName } from "@/lib/layout";

type ArticleFeedPageClientProps = {
  sort: "popular" | "newest";
  category?: string;
  title: string;
  emptyMessage: string;
  showTopicLinks?: boolean;
  hoverPreview?: boolean;
};

export function ArticleFeedPageClient({
  sort,
  category,
  title,
  emptyMessage,
  showTopicLinks = false,
  hoverPreview = false,
}: ArticleFeedPageClientProps) {
  const { data, isLoading } = useListArticlesQuery({
    sort,
    category,
    page: 1,
    limit: ARTICLE_FEED_PAGE_SIZE,
  });

  return (
    <main className={feedMainClassName}>
      {showTopicLinks ? <MaqolalarTopicLinksClient /> : null}
      {isLoading && !data ? (
        <ArticleFeedSkeleton count={3} title={`${title} yuklanmoqda`} />
      ) : data ? (
        <ArticleFeedWithPagination
          feed={data}
          sort={sort}
          category={category}
          title={title}
          emptyMessage={emptyMessage}
          hoverPreview={hoverPreview}
        />
      ) : null}
    </main>
  );
}

export function TopicFeedPageClient({ slug }: { slug: string }) {
  const { topicNavItems, isLoading: topicsLoading } = useTopicNavItems();
  const topic = topicNavItems.find((item) => item.href === `/mavzu/${slug}`);
  const title = topic ? `${topic.label} maqolalari` : "Mavzu maqolalari";
  const emptyMessage = topic
    ? `${topic.label} bo'yicha hozircha maqolalar yo'q.`
    : "Bu mavzu bo'yicha hozircha maqolalar yo'q.";

  if (!topicsLoading && topicNavItems.length > 0 && !topic) {
    notFound();
  }

  return (
    <ArticleFeedPageClient
      sort="popular"
      category={slug}
      title={title}
      emptyMessage={emptyMessage}
      hoverPreview
    />
  );
}
