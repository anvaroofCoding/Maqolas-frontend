import { ArticleFeedWithPagination } from "@/components/articles/article-feed-with-pagination";
import { fetchArticleFeed } from "@/lib/articles/server";

type ArticleFeedSectionProps = {
  sort?: "popular" | "newest";
  category?: string;
  title: string;
  emptyMessage: string;
};

export async function ArticleFeedSection({
  sort = "popular",
  category,
  title,
  emptyMessage,
}: ArticleFeedSectionProps) {
  const feed = await fetchArticleFeed({ sort, category });

  return (
    <ArticleFeedWithPagination
      feed={feed}
      sort={sort}
      category={category}
      title={title}
      emptyMessage={emptyMessage}
    />
  );
}
