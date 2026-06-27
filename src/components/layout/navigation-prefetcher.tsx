"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTopicNavItems } from "@/components/layout/use-topic-nav-items";
import {
  prefetchFeedForHref,
  sidebarPrefetchHrefs,
} from "@/lib/navigation/feed-prefetch";
import { useAppDispatch } from "@/lib/store/hooks";

export function NavigationPrefetcher() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { topicNavItems } = useTopicNavItems();

  useEffect(() => {
    const prefetchAll = () => {
      for (const href of sidebarPrefetchHrefs) {
        router.prefetch(href);
        prefetchFeedForHref(dispatch, href);
      }

      for (const item of topicNavItems) {
        router.prefetch(item.href);
        prefetchFeedForHref(dispatch, item.href);
      }
    };

    if (typeof requestIdleCallback === "function") {
      const idleId = requestIdleCallback(prefetchAll, { timeout: 2500 });
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(prefetchAll, 400);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, router, topicNavItems]);

  return null;
}
