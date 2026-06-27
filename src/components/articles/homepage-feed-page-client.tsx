"use client";

import { HomepageFeedSkeleton } from "@/components/articles/homepage-feed-skeleton";
import { HomepageFeedWithPagination } from "@/components/articles/homepage-feed-with-pagination";
import {
  useGetHomepageLayoutQuery,
  useListArticlesQuery,
} from "@/features/articles/api/articles-api";
import { feedMainClassName } from "@/lib/layout";

export function HomepageFeedPageClient() {
  const { data: homepage, isLoading: homepageLoading } =
    useGetHomepageLayoutQuery();
  const { data: latestFeed } = useListArticlesQuery({
    sort: "newest",
    page: 1,
    limit: 12,
  });

  if (homepageLoading && !homepage) {
    return (
      <main className={feedMainClassName}>
        <HomepageFeedSkeleton title="Siz uchun yuklanmoqda" />
      </main>
    );
  }

  if (!homepage) {
    return (
      <main className={feedMainClassName}>
        <HomepageFeedSkeleton title="Siz uchun yuklanmoqda" />
      </main>
    );
  }

  return (
    <main className={feedMainClassName}>
      <HomepageFeedWithPagination
        layoutData={homepage}
        latestArticles={latestFeed?.articles}
        sort={homepage.algorithm}
        title="Siz uchun"
        emptyMessage="Hozircha maqolalar yo'q. Tez orada yangi kontent paydo bo'ladi."
      />
    </main>
  );
}
