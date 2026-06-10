"use client";

import { useMemo } from "react";
import { categoriesToNavItems } from "@/config/navigation";
import { useListCategoriesQuery } from "@/features/categories/api/categories-api";

export function useTopicNavItems() {
  const { data, isLoading, isFetching } = useListCategoriesQuery();

  const topicNavItems = useMemo(
    () => categoriesToNavItems(data?.categories ?? []),
    [data?.categories],
  );

  return {
    topicNavItems,
    isLoading: isLoading && topicNavItems.length === 0,
    isFetching,
  };
}
