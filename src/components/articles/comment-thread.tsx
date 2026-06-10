"use client";

import {
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  MessageCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleComment } from "@/features/articles/types";
import { CommentContent, formatReplyContent } from "@/lib/comments/content";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

type CommentThreadProps = {
  comment: ArticleComment;
  articleId: string;
  currentUserId?: string;
  isLoggedIn: boolean;
  depth?: number;
  onRequireAuth: () => void;
  onReply: (payload: {
    articleId: string;
    content: string;
    parentId: string;
  }) => Promise<void>;
  onReport: (payload: {
    articleId: string;
    commentId: string;
    reason?: string;
  }) => Promise<void>;
  onDelete: (payload: {
    articleId: string;
    commentId: string;
  }) => Promise<void>;
  onLike: (payload: {
    articleId: string;
    commentId: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};

function AuthorAvatar({
  author,
  authorName,
}: {
  author?: ArticleComment["author"];
  authorName: string;
}) {
  const avatar = (
    <Avatar size="sm">
      {author?.avatarUrl ? (
        <AvatarImage src={author.avatarUrl} alt={authorName} />
      ) : null}
      <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
    </Avatar>
  );

  if (author?.username) {
    return (
      <Link href={`/profil/${author.username}`} className="mt-0.5 shrink-0">
        {avatar}
      </Link>
    );
  }

  return <div className="mt-0.5 shrink-0">{avatar}</div>;
}

function CommentItem({
  comment,
  articleId,
  currentUserId,
  isLoggedIn,
  depth = 0,
  onRequireAuth,
  onReply,
  onReport,
  onDelete,
  onLike,
  isSubmitting,
  isDeleting,
}: CommentThreadProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [repliesHidden, setRepliesHidden] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);

  const authorName = comment.author?.displayName ?? "Noma'lum foydalanuvchi";
  const username = comment.author?.username;
  const isOwnComment = Boolean(
    currentUserId && comment.author?.id === currentUserId,
  );
  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;

  const handleSubmitReply = async () => {
    const text = replyText.trim();
    if (!text || !username) return;

    await onReply({
      articleId,
      content: formatReplyContent(username, text),
      parentId: comment.id,
    });

    setReplyText("");
    setReplyOpen(false);
    setRepliesHidden(false);
  };

  const handleDelete = async () => {
    await onDelete({ articleId, commentId: comment.id });
  };

  const handleReport = async () => {
    if (!isLoggedIn) {
      onRequireAuth();
      return;
    }

    setReporting(true);
    try {
      await onReport({
        articleId,
        commentId: comment.id,
        reason: reportReason.trim() || undefined,
      });
      setReportOpen(false);
      setReportReason("");
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className={cn(depth > 0 && "relative pl-4 sm:pl-5")}>
      {depth > 0 ? (
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-0 w-px bg-border"
        />
      ) : null}

      <div className="flex gap-3">
        <AuthorAvatar author={comment.author} authorName={authorName} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {username ? (
              <Link
                href={`/profil/${username}`}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {authorName}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-foreground">
                {authorName}
              </span>
            )}

            {isOwnComment ? (
              <Badge
                variant="secondary"
                className="h-5 rounded-md px-1.5 text-[10px] font-medium uppercase"
              >
                Siz
              </Badge>
            ) : null}

            {comment.createdAt ? (
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(comment.createdAt)}
              </span>
            ) : null}
          </div>

          <p className="mt-1.5 min-w-0 break-words text-sm leading-relaxed text-foreground/90 [overflow-wrap:anywhere]">
            <CommentContent content={comment.content} />
          </p>

          <div className="mt-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 gap-1 rounded-full px-2.5 text-xs",
                comment.likedByMe
                  ? "text-nav-active hover:bg-transparent hover:text-nav-active"
                  : "text-muted-foreground",
              )}
              aria-pressed={comment.likedByMe}
              onClick={() => {
                if (!isLoggedIn) {
                  onRequireAuth();
                  return;
                }
                void onLike({ articleId, commentId: comment.id });
              }}
            >
              <Heart
                className={cn(
                  "size-3.5",
                  comment.likedByMe && "fill-nav-active text-nav-active",
                )}
              />
              <span className="tabular-nums">
                {formatCount(comment.likeCount ?? 0)}
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground"
              onClick={() => {
                if (!isLoggedIn) {
                  onRequireAuth();
                  return;
                }
                setReplyOpen((open) => !open);
              }}
            >
              <MessageCircle className="size-3.5" />
              Javob
            </Button>

            {!isOwnComment ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 text-muted-foreground hover:text-foreground"
                aria-label="Shikoyat qilish"
                onClick={() => {
                  if (!isLoggedIn) {
                    onRequireAuth();
                    return;
                  }
                  setReportOpen(true);
                }}
              >
                <Flag className="size-3.5" />
              </Button>
            ) : null}

            {isOwnComment ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 text-muted-foreground hover:text-destructive"
                aria-label="Izohni o'chirish"
                disabled={isDeleting}
                onClick={() => void handleDelete()}
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : null}
          </div>

          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Izoh bo&apos;yicha shikoyat</DialogTitle>
                <DialogDescription>
                  Shikoyat sababi ixtiyoriy. Admin ko&apos;rib chiqadi.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label htmlFor={`report-reason-${comment.id}`}>Sabab</Label>
                <Textarea
                  id={`report-reason-${comment.id}`}
                  value={reportReason}
                  onChange={(event) => setReportReason(event.target.value)}
                  placeholder="Masalan: haqoratli so'zlar, spam, yolg'on ma'lumot..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {reportReason.trim().length}/500
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReportOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="button"
                  disabled={reporting}
                  onClick={() => void handleReport()}
                >
                  {reporting ? "Yuborilmoqda..." : "Yuborish"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {replyOpen ? (
            <div className="mt-3 space-y-3">
              <Textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder={
                  username ? `@${username} ga javob...` : "Javob yozing..."
                }
                rows={3}
                maxLength={2000}
                autoFocus
                className="min-h-[88px] resize-none rounded-2xl border-nav-active/40 focus-visible:border-nav-active focus-visible:ring-nav-active/20"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setReplyOpen(false);
                    setReplyText("");
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full bg-nav-active px-5 text-nav-active-foreground hover:bg-nav-active-hover"
                  disabled={!replyText.trim() || isSubmitting}
                  onClick={() => void handleSubmitReply()}
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                </Button>
              </div>
            </div>
          ) : null}

          {hasReplies ? (
            <div className="mt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 rounded-full px-2 text-xs text-muted-foreground"
                onClick={() => setRepliesHidden((hidden) => !hidden)}
              >
                {repliesHidden ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronUp className="size-3.5" />
                )}
                {repliesHidden ? "Ko'rsatish" : "Yashirish"}
              </Button>

              {!repliesHidden ? (
                <div className="mt-3 space-y-4">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      articleId={articleId}
                      currentUserId={currentUserId}
                      isLoggedIn={isLoggedIn}
                      depth={depth + 1}
                      onRequireAuth={onRequireAuth}
                      onReply={onReply}
                      onReport={onReport}
                      onDelete={onDelete}
                      onLike={onLike}
                      isSubmitting={isSubmitting}
                      isDeleting={isDeleting}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CommentThreadList({
  comments,
  articleId,
  currentUserId,
  isLoggedIn,
  onRequireAuth,
  onReply,
  onReport,
  onDelete,
  onLike,
  isSubmitting,
  isDeleting,
}: {
  comments: ArticleComment[];
  articleId: string;
  currentUserId?: string;
  isLoggedIn: boolean;
  onRequireAuth: () => void;
  onReply: CommentThreadProps["onReply"];
  onReport: CommentThreadProps["onReport"];
  onDelete: CommentThreadProps["onDelete"];
  onLike: CommentThreadProps["onLike"];
  isSubmitting?: boolean;
  isDeleting?: boolean;
}) {
  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          articleId={articleId}
          currentUserId={currentUserId}
          isLoggedIn={isLoggedIn}
          onRequireAuth={onRequireAuth}
          onReply={onReply}
          onReport={onReport}
          onDelete={onDelete}
          onLike={onLike}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
