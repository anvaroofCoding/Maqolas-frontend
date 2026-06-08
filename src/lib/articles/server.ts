import { cache } from "react";
import { env } from "@/config/env";
import type { ArticleFeedResponse, ArticleSummary } from "@/features/articles/types";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";

type FeedParams = {
  sort?: "popular" | "newest" | "forYou";
  category?: string;
  page?: number;
  limit?: number;
};

export type SitemapEntry = {
  slug: string;
  updatedAt: string;
};

export type PublicProfileSummary = {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  articlesCount: number;
};

async function fetchJson<T>(url: string, revalidate = 60): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchArticleFeed(
  params: FeedParams = {},
): Promise<ArticleFeedResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("sort", params.sort ?? "popular");
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? ARTICLE_FEED_PAGE_SIZE));
  if (params.category) {
    searchParams.set("category", params.category);
  }

  const data = await fetchJson<ArticleFeedResponse>(
    `${env.NEXT_PUBLIC_API_URL}/articles/feed?${searchParams.toString()}`,
  );

  return (
    data ?? {
      articles: [],
      pagination: {
        page: 1,
        limit: ARTICLE_FEED_PAGE_SIZE,
        total: 0,
        totalPages: 1,
      },
    }
  );
}

export const fetchArticleBySlug = cache(
  async (slug: string, options?: { meta?: boolean }): Promise<ArticleSummary | null> => {
    const metaParam = options?.meta ? "?meta=1" : "";
    const data = await fetchJson<{ article: ArticleSummary }>(
      `${env.NEXT_PUBLIC_API_URL}/articles/slug/${encodeURIComponent(slug)}${metaParam}`,
    );

    return data?.article ?? null;
  },
);

export async function fetchSitemapEntries(): Promise<SitemapEntry[]> {
  const data = await fetchJson<{ entries: SitemapEntry[] }>(
    `${env.NEXT_PUBLIC_API_URL}/articles/sitemap`,
    300,
  );

  return data?.entries ?? [];
}

export const fetchPublicProfile = cache(
  async (username: string): Promise<PublicProfileSummary | null> => {
    const data = await fetchJson<{
      user: {
        displayName: string;
        username: string;
        bio?: string;
        avatarUrl?: string;
      };
      stats: { articlesCount: number };
    }>(
      `${env.NEXT_PUBLIC_API_URL}/users/${encodeURIComponent(username.toLowerCase())}`,
    );

    if (!data?.user) {
      return null;
    }

    return {
      displayName: data.user.displayName,
      username: data.user.username,
      bio: data.user.bio,
      avatarUrl: data.user.avatarUrl,
      articlesCount: data.stats.articlesCount,
    };
  },
);
