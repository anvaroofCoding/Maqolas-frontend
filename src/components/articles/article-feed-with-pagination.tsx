import { ArticleFeed } from "@/components/articles/article-feed";
import { ArticleFeedLoadMore } from "@/components/articles/article-feed-load-more";
import type { ArticleFeedResponse } from "@/features/articles/types";

type ArticleFeedWithPaginationProps = {
  feed: ArticleFeedResponse;
  sort?: "popular" | "newest";
  category?: string;
  title: string;
  emptyMessage: string;
  compact?: boolean;
  hoverPreview?: boolean;
};

export function ArticleFeedWithPagination({
  feed,
  sort = "popular",
  category,
  title,
  emptyMessage,
  compact = false,
  hoverPreview = false,
}: ArticleFeedWithPaginationProps) {
  const hasMore = feed.pagination.page < feed.pagination.totalPages;

  return (
    <>
      <ArticleFeed
        articles={feed.articles}
        title={title}
        emptyMessage={emptyMessage}
        compact={compact}
        hoverPreview={hoverPreview}
      />
      {feed.articles.length > 0 && hasMore ? (
        <ArticleFeedLoadMore
          sort={sort}
          category={category}
          startPage={feed.pagination.page + 1}
          hasMore={hasMore}
          existingIds={feed.articles.map((article) => article.id)}
          compact={compact}
          hoverPreview={hoverPreview}
        />
      ) : null}
    </>
  );
}
