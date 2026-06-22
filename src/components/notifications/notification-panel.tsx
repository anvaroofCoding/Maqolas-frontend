"use client";

import { CheckCheckIcon } from "lucide-react";
import { NotificationBubble } from "@/components/notifications/notification-bubble";
import { NotificationSkeletonList } from "@/components/notifications/notification-skeleton";
import { Button } from "@/components/ui/button";
import { useNotificationFeed } from "@/hooks/use-notification-feed";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  active: boolean;
  enabled?: boolean;
  className?: string;
  listClassName?: string;
}

export function NotificationPanel({
  active,
  enabled = true,
  className,
  listClassName,
}: NotificationPanelProps) {
  const {
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
  } = useNotificationFeed(active, enabled);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
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
        className={cn(
          "notification-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3",
          listClassName,
        )}
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
    </div>
  );
}
