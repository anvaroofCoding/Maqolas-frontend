"use client";

import { useEffect, useState } from "react";
import { HomepageFeedWithPagination } from "@/components/articles/homepage-feed-with-pagination";
import { HomepageFeedSkeleton } from "@/components/articles/homepage-feed-skeleton";
import { HomepageSeoIntroSkeleton } from "@/components/seo/homepage-seo-intro-skeleton";
import { useGetHomepageLayoutQuery } from "@/features/articles/api/articles-api";
import type { HomepageLayoutResponse } from "@/features/articles/types";
import { useAppSelector } from "@/lib/store/hooks";

type HomepageFeedContainerProps = {
  initialData: HomepageLayoutResponse;
  title: string;
  emptyMessage: string;
};

export function HomepageFeedContainer({
  initialData,
  title,
  emptyMessage,
}: HomepageFeedContainerProps) {
  const [mounted, setMounted] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useGetHomepageLayoutQuery(undefined, {
    skip: !mounted || !accessToken,
  });

  const activeData = data ?? initialData;

  if (mounted && accessToken && isLoading) {
    return (
      <>
        <HomepageSeoIntroSkeleton label={`${title} yuklanmoqda`} />
        <HomepageFeedSkeleton title={`${title} yuklanmoqda`} showIntro={false} />
      </>
    );
  }

  return (
    <HomepageFeedWithPagination
      layoutData={activeData}
      sort={activeData.algorithm}
      title={title}
      emptyMessage={emptyMessage}
    />
  );
}
