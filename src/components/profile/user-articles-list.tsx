"use client";

import { ArticleFeedInfinite } from "@/components/articles/article-feed-infinite";
import type { ArticleFeedResponse, ArticleSummary } from "@/features/articles/types";

type UserArticlesListProps = {
  username: string;
  displayName: string;
  initialArticles?: ArticleSummary[];
  initialPagination?: ArticleFeedResponse["pagination"];
};

export function UserArticlesList({
  username,
  displayName,
  initialArticles,
  initialPagination,
}: UserArticlesListProps) {
  return (
    <ArticleFeedInfinite
      variant="user"
      username={username}
      compact
      initialArticles={initialArticles}
      initialPagination={initialPagination}
      emptyMessage={`${displayName} hali nashr etilgan maqolalar yozmagan.`}
    />
  );
}
