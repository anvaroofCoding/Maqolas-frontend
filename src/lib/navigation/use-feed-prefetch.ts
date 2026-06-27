"use client";

import { useCallback } from "react";
import { prefetchFeedForHref } from "@/lib/navigation/feed-prefetch";
import { useAppDispatch } from "@/lib/store/hooks";

export function useFeedPrefetch() {
  const dispatch = useAppDispatch();

  return useCallback(
    (href: string) => {
      prefetchFeedForHref(dispatch, href);
    },
    [dispatch],
  );
}
