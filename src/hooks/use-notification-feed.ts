"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useGetUnreadNotificationCountQuery,
  useLazyGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/features/notifications/api/notifications-api";
import type { NotificationItem } from "@/features/notifications/types";

const PAGE_SIZE = 12;

export function useNotificationFeed(active: boolean, enabled = true) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !enabled,
  });
  const [fetchNotifications] = useLazyGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();

  const unreadCount = unreadData?.count ?? 0;

  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (nextPage === 1) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const result = await fetchNotifications({
          page: nextPage,
          limit: PAGE_SIZE,
        }).unwrap();

        setItems((current) =>
          replace
            ? result.notifications
            : [...current, ...result.notifications],
        );
        setHasMore(result.pagination.page < result.pagination.totalPages);
        setPage(nextPage);
      } finally {
        loadingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchNotifications],
  );

  useEffect(() => {
    if (!active || !enabled) return;
    void loadPage(1, true);
  }, [active, enabled, loadPage]);

  useEffect(() => {
    if (!active || !enabled || !hasMore || loadingMore || initialLoading) return;

    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadPage(page + 1);
        }
      },
      { root, rootMargin: "80px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [active, enabled, hasMore, loadingMore, initialLoading, page, loadPage]);

  const handleRead = useCallback(
    async (id: string) => {
      const target = items.find((item) => item.id === id);
      if (!target || target.isRead) return;

      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        ),
      );
      await markRead(id);
    },
    [items, markRead],
  );

  const handleMarkAllRead = useCallback(async () => {
    if (unreadCount === 0) return;
    setItems((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );
    await markAllRead();
  }, [markAllRead, unreadCount]);

  return {
    items,
    unreadCount,
    initialLoading,
    loadingMore,
    hasMore,
    scrollRef,
    sentinelRef,
    handleRead,
    handleMarkAllRead,
    isMarkingAll,
  };
}
