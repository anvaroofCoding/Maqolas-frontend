import { HomepageFeed } from "@/components/articles/homepage-feed";
import { HomepageWriteInviteBanner } from "@/components/articles/homepage-write-invite-banner";
import { ArticleFeedLoadMore } from "@/components/articles/article-feed-load-more";
import type { ArticleFeedResponse } from "@/features/articles/types";

type HomepageFeedWithPaginationProps = {
  feed: ArticleFeedResponse;
  latestFeed?: ArticleFeedResponse;
  sort?: "popular" | "newest";
  category?: string;
  title: string;
  emptyMessage: string;
};

export function HomepageFeedWithPagination({
  feed,
  latestFeed,
  sort = "popular",
  category,
  title,
  emptyMessage,
}: HomepageFeedWithPaginationProps) {
  const hasMore = feed.pagination.page < feed.pagination.totalPages;

  return (
    <div className="relative space-y-8 pb-28 md:space-y-10 md:pb-32">
      <HomepageFeed
        articles={feed.articles}
        latestArticles={latestFeed?.articles}
        title={title}
        emptyMessage={emptyMessage}
      />
      {feed.articles.length > 0 && hasMore ? (
        <ArticleFeedLoadMore
          sort={sort}
          category={category}
          startPage={feed.pagination.page + 1}
          hasMore={hasMore}
          existingIds={feed.articles.map((article) => article.id)}
          compact
        />
      ) : null}
      <HomepageWriteInviteBanner />
    </div>
  );
}
