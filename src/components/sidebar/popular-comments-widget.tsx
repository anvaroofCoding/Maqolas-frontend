"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPopularCommentsQuery } from "@/features/articles/api/articles-api";
import { commentPreviewText } from "@/lib/comments/preview";
import { formatRelativeTime } from "@/lib/format";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

type PopularCommentsWidgetProps = {
  currentUserId?: string;
};

export function PopularCommentsWidget({
  currentUserId,
}: PopularCommentsWidgetProps) {
  const { data, isLoading } = useGetPopularCommentsQuery({ limit: 5 });
  const comments = data?.comments ?? [];

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-semibold tracking-tight">
          Mashxur izohlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Hozircha mashxur izohlar yo&apos;q.
          </p>
        ) : (
          comments.map((comment) => {
            const authorName =
              comment.author?.displayName ?? "Noma'lum foydalanuvchi";
            const isOwn = Boolean(
              currentUserId && comment.author?.id === currentUserId,
            );

            return (
              <Link
                key={comment.id}
                href={`/maqola/${comment.article.slug}#comments`}
                className="group flex gap-3 rounded-xl p-1 transition-colors hover:bg-muted/40"
              >
                <Avatar size="sm" className="mt-0.5 shrink-0">
                  {comment.author?.avatarUrl ? (
                    <AvatarImage
                      src={comment.author.avatarUrl}
                      alt={authorName}
                    />
                  ) : null}
                  <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      isOwn ? "text-nav-active" : "text-foreground",
                    )}
                  >
                    {authorName}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-foreground/80">
                    {commentPreviewText(comment.content)}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {comment.createdAt ? (
                      <span>{formatRelativeTime(comment.createdAt)}</span>
                    ) : null}
                    {comment.likeCount > 0 ? (
                      <span>· {comment.likeCount} like</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
