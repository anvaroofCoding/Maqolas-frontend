import { env } from "@/config/env";
import type { ArticleFeedResponse, ArticleSummary } from "@/features/articles/types";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";

type FeedParams = {
  sort?: "popular" | "newest" | "forYou";
  category?: string;
  page?: number;
  limit?: number;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
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

export async function fetchArticleBySlug(
  slug: string,
): Promise<ArticleSummary | null> {
  const data = await fetchJson<{ article: ArticleSummary }>(
    `${env.NEXT_PUBLIC_API_URL}/articles/slug/${encodeURIComponent(slug)}`,
  );

  return data?.article ?? null;
}
