"use client";

import { BellIcon, CheckCheckIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { NotificationBubble } from "@/components/notifications/notification-bubble";
import { NotificationSkeletonList } from "@/components/notifications/notification-skeleton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetUnreadNotificationCountQuery,
  useLazyGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/features/notifications/api/notifications-api";
import type { NotificationItem } from "@/features/notifications/types";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export function NotificationPopover() {
  const [mounted, setMounted] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => setMounted(true), []);

  const isActive = mounted && Boolean(accessToken);

  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !isActive,
    pollingInterval: 30_000,
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
    if (!open) return;
    void loadPage(1, true);
  }, [open, loadPage]);

  useEffect(() => {
    if (!open || !hasMore || loadingMore || initialLoading) return;

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
  }, [open, hasMore, loadingMore, initialLoading, page, loadPage]);

  async function handleRead(id: string) {
    const target = items.find((item) => item.id === id);
    if (!target || target.isRead) return;

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );
    await markRead(id);
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    setItems((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );
    await markAllRead();
  }

  if (!isActive) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("relative", navIconButtonClass)}
        aria-label="Bildirishnomalar"
        disabled={!mounted}
      >
        <BellIcon />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("relative", navIconButtonClass)}
          aria-label="Bildirishnomalar"
        >
          <BellIcon />
          {unreadCount > 0 ? (
            <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-nav-active px-1 py-0.5 text-[10px] font-semibold leading-none text-nav-active-foreground ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden p-0"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Bildirishnomalar</p>
            {unreadCount > 0 ? (
              <p className="text-xs text-muted-foreground">
                {unreadCount} ta o&apos;qilmagan
              </p>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              disabled={isMarkingAll}
              onClick={() => void handleMarkAllRead()}
            >
              <CheckCheckIcon className="size-3.5" />
              Hammasi
            </Button>
          ) : null}
        </div>

        <div
          ref={scrollRef}
          className="notification-scroll max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain px-3 py-3"
        >
          {initialLoading ? (
            <NotificationSkeletonList count={4} />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <div className="notification-empty-bubble rounded-2xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
                Hozircha bildirishnomalar yo&apos;q
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((notification, index) => (
                <NotificationBubble
                  key={notification.id ?? `${notification.createdAt}-${index}`}
                  notification={notification}
                  index={index}
                  onRead={handleRead}
                />
              ))}
            </div>
          )}

          {loadingMore ? <NotificationSkeletonList count={2} /> : null}

          {!initialLoading && hasMore ? (
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden />
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
