"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import {
  useLazyListArticlesQuery,
  useLazyListSavedArticlesQuery,
} from "@/features/articles/api/articles-api";
import type { ArticleSummary } from "@/features/articles/types";
import { useLazyGetUserArticlesQuery } from "@/features/users/api/users-api";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";
import { cn } from "@/lib/utils";

type FeedVariant = "feed" | "saved" | "user";

type ArticleFeedLoadMoreProps = {
  variant?: FeedVariant;
  sort?: "popular" | "newest" | "forYou";
  category?: string;
  username?: string;
  startPage: number;
  hasMore: boolean;
  existingIds: string[];
  compact?: boolean;
};

function mergeArticles(
  current: ArticleSummary[],
  incoming: ArticleSummary[],
  existingIds: string[],
) {
  const seen = new Set([...existingIds, ...current.map((article) => article.id)]);
  const next = incoming.filter((article) => !seen.has(article.id));
  return next.length > 0 ? [...current, ...next] : current;
}

export function ArticleFeedLoadMore({
  variant = "feed",
  sort = "popular",
  category,
  username,
  startPage,
  hasMore: initialHasMore,
  existingIds,
  compact = false,
}: ArticleFeedLoadMoreProps) {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [page, setPage] = useState(startPage - 1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const [fetchFeed] = useLazyListArticlesQuery();
  const [fetchSaved] = useLazyListSavedArticlesQuery();
  const [fetchUserArticles] = useLazyGetUserArticlesQuery();

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (loadingRef.current || nextPage < startPage) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        let result;

        if (variant === "saved") {
          result = await fetchSaved({
            page: nextPage,
            limit: ARTICLE_FEED_PAGE_SIZE,
          }).unwrap();
        } else if (variant === "user" && username) {
          result = await fetchUserArticles({
            username,
            page: nextPage,
            limit: ARTICLE_FEED_PAGE_SIZE,
          }).unwrap();
        } else {
          result = await fetchFeed({
            sort,
            category,
            page: nextPage,
            limit: ARTICLE_FEED_PAGE_SIZE,
          }).unwrap();
        }

        setArticles((current) =>
          mergeArticles(current, result.articles, existingIds),
        );
        setHasMore(result.pagination.page < result.pagination.totalPages);
        setPage(nextPage);
      } catch {
        setHasMore(false);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [
      category,
      existingIds,
      fetchFeed,
      fetchSaved,
      fetchUserArticles,
      sort,
      startPage,
      username,
      variant,
    ],
  );

  useEffect(() => {
    if (!hasMore || loading) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadPage(page + 1);
        }
      },
      { rootMargin: "240px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadPage, page]);

  if (!initialHasMore && articles.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-4",
          compact ? "pt-0 pb-2" : "pb-4 md:gap-5 md:pb-6",
        )}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {loading ? (
        <ArticleFeedSkeleton count={2} compact={compact} inline />
      ) : null}

      {hasMore ? (
        <div ref={sentinelRef} className="h-8 w-full" aria-hidden />
      ) : null}
    </>
  );
}
