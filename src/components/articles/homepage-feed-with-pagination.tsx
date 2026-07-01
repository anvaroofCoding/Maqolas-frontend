import { HomepageFeed } from "@/components/articles/homepage-feed";
import { HomepageWriteInviteBanner } from "@/components/articles/homepage-write-invite-banner";
import { ArticleFeedLoadMore } from "@/components/articles/article-feed-load-more";
import type { HomepageLayoutResponse } from "@/features/articles/types";

type HomepageFeedWithPaginationProps = {
  layoutData: HomepageLayoutResponse;
  latestArticles?: HomepageLayoutResponse["feed"]["articles"];
  sort?: "popular" | "newest" | "forYou";
  category?: string;
  title: string;
  emptyMessage: string;
};

export function HomepageFeedWithPagination({
  layoutData,
  latestArticles,
  sort = "popular",
  category,
  title,
  emptyMessage,
}: HomepageFeedWithPaginationProps) {
  const { layout, algorithm, feed } = layoutData;
  const hasMore = feed.pagination.page < feed.pagination.totalPages;
  const feedSort: "popular" | "newest" | "forYou" =
    algorithm === "forYou" ? "forYou" : sort;

  return (
    <div className="relative space-y-6 md:space-y-8 2xl:space-y-10">
      <HomepageFeed
        layout={layout}
        algorithm={algorithm}
        latestArticles={latestArticles}
        fallbackArticles={feed.articles}
        title={title}
        emptyMessage={emptyMessage}
      />
      {feed.articles.length > 0 && hasMore ? (
        <section
          aria-label="Boshqa maqolalar"
          className="space-y-4 border-t border-border pt-6 md:space-y-5 md:pt-8"
        >
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
            Boshqa maqolalar
          </h2>
          <ArticleFeedLoadMore
            sort={feedSort}
            category={category}
            startPage={feed.pagination.page + 1}
            hasMore={hasMore}
            existingIds={feed.articles.map((article) => article.id)}
            compact
          />
        </section>
      ) : null}
      <HomepageWriteInviteBanner />
    </div>
  );
}
