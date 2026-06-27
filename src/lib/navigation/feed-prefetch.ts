import { articlesApi } from "@/features/articles/api/articles-api";
import { categoriesApi } from "@/features/categories/api/categories-api";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";
import type { AppDispatch } from "@/lib/store";

const prefetchOptions = {
  subscribe: false,
  forceRefetch: false,
} as const;

export function prefetchFeedForHref(dispatch: AppDispatch, href: string) {
  if (href === "/") {
    dispatch(
      articlesApi.endpoints.getHomepageLayout.initiate(undefined, prefetchOptions),
    );
    dispatch(
      articlesApi.endpoints.listArticles.initiate(
        { sort: "newest", page: 1, limit: 12 },
        prefetchOptions,
      ),
    );
    return;
  }

  if (href === "/maqolalar") {
    dispatch(
      articlesApi.endpoints.listArticles.initiate(
        { sort: "popular", page: 1, limit: ARTICLE_FEED_PAGE_SIZE },
        prefetchOptions,
      ),
    );
    dispatch(categoriesApi.endpoints.listCategories.initiate(undefined, prefetchOptions));
    return;
  }

  if (href === "/yangi") {
    dispatch(
      articlesApi.endpoints.listArticles.initiate(
        { sort: "newest", page: 1, limit: ARTICLE_FEED_PAGE_SIZE },
        prefetchOptions,
      ),
    );
    return;
  }

  if (href === "/mavzular") {
    dispatch(categoriesApi.endpoints.listCategories.initiate(undefined, prefetchOptions));
    return;
  }

  const topicMatch = href.match(/^\/mavzu\/([^/]+)$/);
  if (topicMatch) {
    dispatch(
      articlesApi.endpoints.listArticles.initiate(
        {
          sort: "popular",
          category: topicMatch[1],
          page: 1,
          limit: ARTICLE_FEED_PAGE_SIZE,
        },
        prefetchOptions,
      ),
    );
  }
}

export const sidebarPrefetchHrefs = [
  "/",
  "/maqolalar",
  "/yangi",
  "/mavzular",
  "/lenta",
] as const;
