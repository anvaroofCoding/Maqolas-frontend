"use client";

import { Newspaper } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import {
  useLazyListArticlesQuery,
  useLazyListSavedArticlesQuery,
} from "@/features/articles/api/articles-api";
import type { ArticleFeedResponse, ArticleSummary } from "@/features/articles/types";
import { useLazyGetUserArticlesQuery } from "@/features/users/api/users-api";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";
import { articleFeedGridClassName } from "@/lib/layout";
import type { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";

type FeedVariant = "feed" | "saved" | "user";

type ArticleFeedInfiniteProps = {
  variant?: FeedVariant;
  sort?: "popular" | "newest" | "forYou";
  category?: string;
  username?: string;
  personalizedWhenAuth?: boolean;
  initialArticles?: ArticleSummary[];
  initialPagination?: ArticleFeedResponse["pagination"];
  title?: string;
  emptyMessage?: string;
  emptyFallback?: React.ReactNode;
  compact?: boolean;
};

function mergeArticles(
  current: ArticleSummary[],
  incoming: ArticleSummary[],
) {
  const seen = new Set(current.map((article) => article.id));
  const next = incoming.filter((article) => !seen.has(article.id));
  return next.length > 0 ? [...current, ...next] : current;
}

export function ArticleFeedInfinite({
  variant = "feed",
  sort = "popular",
  category,
  username,
  personalizedWhenAuth = false,
  initialArticles,
  initialPagination,
  title,
  emptyMessage = "Hozircha nashr etilgan maqolalar yo'q.",
  emptyFallback,
  compact = false,
}: ArticleFeedInfiniteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const effectiveSort = useMemo(() => {
    if (variant !== "feed" || !personalizedWhenAuth) {
      return sort;
    }
    return isAuthenticated ? "forYou" : sort;
  }, [isAuthenticated, personalizedWhenAuth, sort, variant]);

  const canUseInitialData =
    Boolean(initialArticles && initialPagination) &&
    ((variant === "feed" && effectiveSort === sort) ||
      (variant === "user" && Boolean(username)));

  const [articles, setArticles] = useState<ArticleSummary[]>(
    canUseInitialData ? initialArticles! : [],
  );
  const [page, setPage] = useState(
    canUseInitialData ? (initialPagination?.page ?? 1) : 0,
  );
  const [hasMore, setHasMore] = useState(
    canUseInitialData
      ? (initialPagination?.page ?? 1) < (initialPagination?.totalPages ?? 1)
      : true,
  );
  const [initialLoading, setInitialLoading] = useState(!canUseInitialData);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const loadedSortRef = useRef<string | null>(
    canUseInitialData ? effectiveSort : null,
  );

  const [fetchFeed] = useLazyListArticlesQuery();
  const [fetchSaved] = useLazyListSavedArticlesQuery();
  const [fetchUserArticles] = useLazyGetUserArticlesQuery();

  const loadPage = useCallback(
    async (nextPage: number, feedSort = effectiveSort) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (nextPage === 1) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let result: ArticleFeedResponse | undefined;

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
            sort: feedSort,
            category,
            page: nextPage,
            limit: ARTICLE_FEED_PAGE_SIZE,
          }).unwrap();
        }

        if (!result) return;

        setArticles((current) =>
          nextPage === 1
            ? result!.articles
            : mergeArticles(current, result!.articles),
        );
        setHasMore(result.pagination.page < result.pagination.totalPages);
        setPage(nextPage);
        loadedSortRef.current = feedSort;
      } finally {
        loadingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [
      category,
      effectiveSort,
      fetchFeed,
      fetchSaved,
      fetchUserArticles,
      username,
      variant,
    ],
  );

  useEffect(() => {
    if (loadedSortRef.current === effectiveSort) {
      return;
    }

    void loadPage(1, effectiveSort);
  }, [effectiveSort, loadPage]);

  useEffect(() => {
    if (initialLoading || loadingMore || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadPage(page + 1, effectiveSort);
        }
      },
      { rootMargin: "240px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [effectiveSort, initialLoading, loadingMore, hasMore, page, loadPage]);

  if (initialLoading) {
    return (
      <ArticleFeedSkeleton
        count={3}
        title={title ? `${title} yuklanmoqda` : undefined}
        compact={compact}
      />
    );
  }

  if (articles.length === 0) {
    if (emptyFallback) return <>{emptyFallback}</>;

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <Newspaper className="size-10 text-muted-foreground/60" aria-hidden />
        <p className="max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section aria-label={title ?? "Maqolalar"} className="min-w-0 max-w-full">
      {title ? <h1 className="sr-only">{title}</h1> : null}
      <div
        className={cn(
          articleFeedGridClassName,
          compact ? "pt-0 pb-2" : "pb-4 pt-2 md:pb-6 md:pt-0",
        )}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {loadingMore ? (
        <ArticleFeedSkeleton count={2} compact={compact} inline />
      ) : null}

      {hasMore ? (
        <div ref={sentinelRef} className="h-8 w-full" aria-hidden />
      ) : null}
    </section>
  );
}
