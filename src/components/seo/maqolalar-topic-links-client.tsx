"use client";

import { useListCategoriesQuery } from "@/features/categories/api/categories-api";
import { MaqolalarTopicLinks } from "@/components/seo/maqolalar-topic-links";

export function MaqolalarTopicLinksClient() {
  const { data } = useListCategoriesQuery();

  if (!data?.categories.length) {
    return null;
  }

  return <MaqolalarTopicLinks categories={data.categories} />;
}
