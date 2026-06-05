"use client";

import {
  CheckCircle2Icon,
  HeartIcon,
  MessageSquareIcon,
  ReplyIcon,
  UserPlusIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { NotificationItem } from "@/features/notifications/types";
import { formatRelativeTime } from "@/lib/format";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

const typeIcons = {
  article_liked: HeartIcon,
  article_commented: MessageSquareIcon,
  comment_replied: ReplyIcon,
  user_followed: UserPlusIcon,
  article_approved: CheckCircle2Icon,
  article_rejected: XCircleIcon,
} as const;

interface NotificationBubbleProps {
  notification: NotificationItem;
  index: number;
  onRead: (id: string) => void;
}

export function NotificationBubble({
  notification,
  index,
  onRead,
}: NotificationBubbleProps) {
  const Icon = typeIcons[notification.type];
  const actorName =
    notification.actor?.displayName ??
    notification.actor?.username ??
    "Maqolas";

  const content = (
    <div
      className={cn(
        "notification-bubble group flex gap-2.5",
        !notification.isRead && "notification-bubble--unread",
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Avatar className="mt-1 size-9 shrink-0 ring-2 ring-background">
        {notification.actor?.avatarUrl ? (
          <AvatarImage src={notification.actor.avatarUrl} alt={actorName} />
        ) : null}
        <AvatarFallback className="bg-nav-active/10 text-xs text-nav-active">
          {getUserInitials(actorName)}
        </AvatarFallback>
      </Avatar>

      <div className="relative min-w-0 flex-1">
        <div className="notification-bubble__body relative rounded-2xl rounded-tl-sm border px-3.5 py-2.5 shadow-sm">
          <div className="mb-1 flex items-start gap-2">
            <Icon
              className={cn(
                "mt-0.5 size-3.5 shrink-0",
                notification.type === "article_rejected"
                  ? "text-destructive"
                  : notification.type === "article_approved"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-nav-active",
              )}
              aria-hidden
            />
            <p className="text-sm leading-snug text-foreground">
              {notification.message}
            </p>
          </div>
          <p className="pl-5 text-[11px] text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </p>
          {!notification.isRead ? (
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-nav-active" />
          ) : null}
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        className="block outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={() => onRead(notification.id)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="block w-full text-left outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-ring/50"
      onClick={() => onRead(notification.id)}
    >
      {content}
    </button>
  );
}
