"use client";

import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePinCommentMutation,
  useDeletePinCommentMutation,
  useTogglePinCommentLikeMutation,
} from "@/features/pins/api/pins-api";
import type { PinComment } from "@/features/pins/types";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { getUserInitials } from "@/lib/user";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type PinCommentSectionProps = {
  pinId: string;
  comments: PinComment[];
  onRequireAuth: () => void;
  compact?: boolean;
};

function PinCommentItem({
  comment,
  pinId,
  currentUserId,
  isLoggedIn,
  depth = 0,
  onRequireAuth,
}: {
  comment: PinComment;
  pinId: string;
  currentUserId?: string;
  isLoggedIn: boolean;
  depth?: number;
  onRequireAuth: () => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [createComment, { isLoading: submitting }] =
    useCreatePinCommentMutation();
  const [deleteComment, { isLoading: deleting }] =
    useDeletePinCommentMutation();
  const [toggleLike] = useTogglePinCommentLikeMutation();

  const authorName = comment.author?.displayName ?? "Foydalanuvchi";
  const isOwner = currentUserId && comment.author?.id === currentUserId;

  const handleReply = async () => {
    const content = replyText.trim();
    if (!content) return;

    try {
      await createComment({
        pinId,
        content,
        parentId: comment.id,
      }).unwrap();
      setReplyText("");
      setReplyOpen(false);
      toast.success("Javob qo'shildi");
    } catch {
      toast.error("Javob yuborilmadi");
    }
  };

  return (
    <li className="space-y-3">
      <article className="flex min-w-0 gap-3">
        {comment.author?.username ? (
          <Link href={`/profil/${comment.author.username}`} className="shrink-0">
            <Avatar size="sm">
              {comment.author.avatarUrl ? (
                <AvatarImage src={comment.author.avatarUrl} alt={authorName} />
              ) : null}
              <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{authorName}</p>
              {comment.createdAt ? (
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={comment.createdAt}
                >
                  {formatRelativeTime(comment.createdAt)}
                </time>
              ) : null}
            </div>
            <p className="mt-1 min-w-0 break-words whitespace-pre-wrap text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">
              {comment.content}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 rounded-full px-2 text-xs text-muted-foreground",
                comment.likedByMe && "text-rose-500",
              )}
              onClick={() => {
                if (!isLoggedIn) {
                  onRequireAuth();
                  return;
                }
                void toggleLike({ pinId, commentId: comment.id });
              }}
            >
              <Heart
                className={cn("mr-1 size-3.5", comment.likedByMe && "fill-current")}
                aria-hidden
              />
              {formatCount(comment.likeCount)}
            </Button>

            {depth < 2 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-2 text-xs text-muted-foreground"
                onClick={() => {
                  if (!isLoggedIn) {
                    onRequireAuth();
                    return;
                  }
                  setReplyOpen((open) => !open);
                }}
              >
                Javob
              </Button>
            ) : null}

            {isOwner ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-2 text-xs text-muted-foreground"
                disabled={deleting}
                onClick={() => {
                  void deleteComment({ pinId, commentId: comment.id });
                }}
              >
                <Trash2 className="mr-1 size-3.5" aria-hidden />
                O&apos;chirish
              </Button>
            ) : null}
          </div>

          {replyOpen ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder="Javob yozing..."
                rows={2}
                className="min-h-16 resize-none rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyOpen(false)}
                >
                  Bekor
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={submitting || !replyText.trim()}
                  onClick={() => void handleReply()}
                >
                  Yuborish
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </article>

      {comment.replies?.length ? (
        <ul className="mt-3 space-y-3 border-l border-border/60 pl-3 sm:pl-4">
          {comment.replies.map((reply) => (
            <PinCommentItem
              key={reply.id}
              comment={reply}
              pinId={pinId}
              currentUserId={currentUserId}
              isLoggedIn={isLoggedIn}
              depth={depth + 1}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export const PinCommentSection = forwardRef<
  HTMLElement,
  PinCommentSectionProps
>(function PinCommentSection(
  { pinId, comments, onRequireAuth, compact = false },
  ref,
) {
  const [commentText, setCommentText] = useState("");
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: meData } = useGetMeQuery(undefined, { skip: !accessToken });
  const currentUser = meData?.user;
  const [createComment, { isLoading }] = useCreatePinCommentMutation();

  const handleSubmit = async () => {
    const content = commentText.trim();
    if (!content) return;

    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    try {
      await createComment({ pinId, content }).unwrap();
      setCommentText("");
      toast.success("Izoh qo'shildi");
    } catch {
      toast.error("Izoh yuborilmadi");
    }
  };

  return (
    <section ref={ref} className={cn("space-y-4", compact && "space-y-3")}>
      {!compact ? (
        <h2 className="text-base font-semibold text-foreground">Izohlar</h2>
      ) : null}

      <div className="space-y-2">
        <Textarea
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Fikringizni yozing..."
          rows={compact ? 2 : 3}
          className={cn(
            "resize-none rounded-2xl",
            compact ? "min-h-16" : "min-h-20",
          )}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            className="rounded-full"
            disabled={isLoading || !commentText.trim()}
            onClick={() => void handleSubmit()}
          >
            Izoh qoldirish
          </Button>
        </div>
      </div>

      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <PinCommentItem
              key={comment.id}
              comment={comment}
              pinId={pinId}
              currentUserId={currentUser?.id}
              isLoggedIn={isAuthenticated}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Hozircha izohlar yo&apos;q. Birinchi bo&apos;lib fikr qoldiring.
        </p>
      )}
    </section>
  );
});
