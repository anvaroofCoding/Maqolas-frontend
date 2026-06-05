"use client";

import { ArticleFeedInfinite } from "@/components/articles/article-feed-infinite";

type UserArticlesListProps = {
  username: string;
  displayName: string;
};

export function UserArticlesList({ username, displayName }: UserArticlesListProps) {
  return (
    <ArticleFeedInfinite
      variant="user"
      username={username}
      compact
      emptyMessage={`${displayName} hali nashr etilgan maqolalar yozmagan.`}
    />
  );
}
