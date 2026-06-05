"use client";

import { Bookmark, Eye, Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { CommentThreadList } from "@/components/articles/comment-thread";
import { FlyingLikeHeart, iosIconClass } from "@/components/articles/flying-like-heart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import {
  useCreateArticleCommentMutation,
  useDeleteArticleCommentMutation,
  useToggleCommentLikeMutation,
  useReportCommentMutation,
  useGetArticleCommentsQuery,
  useGetArticleEngagementQuery,
  useToggleArticleLikeMutation,
  useToggleArticleSaveMutation,
} from "@/features/articles/api/articles-api";
import { formatCount } from "@/lib/format";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type ArticleEngagementProps = {
  articleId: string;
  viewCount?: number;
  initialLikeCount?: number;
  initialCommentCount?: number;
};

function EngagementAction({
  label,
  count,
  active,
  onClick,
  icon,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-10 gap-2 rounded-full border-0 bg-transparent px-3 font-normal text-muted-foreground shadow-none",
        "hover:bg-transparent hover:text-foreground",
        active && "text-nav-active",
      )}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
      {typeof count === "number" ? (
        <span className="text-sm tabular-nums">{formatCount(count)}</span>
      ) : null}
    </Button>
  );
}

export function ArticleEngagement({
  articleId,
  viewCount = 0,
  initialLikeCount = 0,
  initialCommentCount = 0,
}: ArticleEngagementProps) {
  const commentsRef = useRef<HTMLElement>(null);
  const likeHeartRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [flyTarget, setFlyTarget] = useState<DOMRect | null>(null);
  const [heartSettling, setHeartSettling] = useState(false);

  useEffect(() => setMounted(true), []);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoggedIn = mounted && (isAuthenticated || Boolean(accessToken));

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });
  const currentUser = meData?.user ?? authUser;

  const { data: engagementData, isLoading: engagementLoading } =
    useGetArticleEngagementQuery(articleId, { skip: !mounted });
  const { data: commentsData, isLoading: commentsLoading } =
    useGetArticleCommentsQuery({ articleId }, { skip: !mounted });
  const [toggleLike] = useToggleArticleLikeMutation();
  const [toggleSave] = useToggleArticleSaveMutation();
  const [createComment, { isLoading: commentSubmitting }] =
    useCreateArticleCommentMutation();
  const [deleteComment, { isLoading: commentDeleting }] =
    useDeleteArticleCommentMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();
  const [reportComment] = useReportCommentMutation();

  const likeCount = engagementData?.likeCount ?? initialLikeCount;
  const commentCount = engagementData?.commentCount ?? initialCommentCount;
  const likedByMe = engagementData?.likedByMe ?? false;
  const savedByMe = engagementData?.savedByMe ?? false;
  const comments = commentsData?.comments ?? [];

  const requireAuth = (action: () => void) => {
    if (!mounted || !isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    action();
  };

  const handleLike = () => {
    requireAuth(() => {
      const willLike = !likedByMe;

      if (willLike && likeHeartRef.current) {
        setFlyTarget(likeHeartRef.current.getBoundingClientRect());
      }

      void toggleLike(articleId).catch(() => {
        setFlyTarget(null);
        setHeartSettling(false);
      });
    });
  };

  const handleFlyComplete = () => {
    setFlyTarget(null);
    setHeartSettling(true);
    window.setTimeout(() => setHeartSettling(false), 360);
  };

  const isFlyingLike = flyTarget !== null;

  const handleSubmitComment = () => {
    const content = commentText.trim();
    if (!content) return;

    if (!mounted || !isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    void (async () => {
      try {
        await createComment({ articleId, content }).unwrap();
        setCommentText("");
      } catch {
        // keep draft on failure
      }
    })();
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex h-10 items-center gap-2 px-3 text-sm text-muted-foreground">
            <Eye className={iosIconClass} aria-hidden />
            <span className="tabular-nums">{formatCount(viewCount)}</span>
          </span>

          {engagementLoading ? (
            <Skeleton className="h-10 w-20 rounded-full" />
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 gap-2 rounded-full border-0 bg-transparent px-3 font-normal text-muted-foreground shadow-none",
                "hover:bg-transparent hover:text-foreground",
                likedByMe && "text-nav-active",
              )}
              aria-label="Yoqtirish"
              aria-pressed={likedByMe}
              onClick={handleLike}
            >
              <span
                ref={likeHeartRef}
                className={cn(
                  "inline-flex",
                  isFlyingLike && "opacity-0",
                  heartSettling && "like-heart-settle",
                )}
              >
                <Heart
                  className={cn(
                    iosIconClass,
                    likedByMe && "fill-nav-active text-nav-active",
                  )}
                  aria-hidden
                />
              </span>
              <span className="text-sm tabular-nums">{formatCount(likeCount)}</span>
            </Button>
          )}

          {flyTarget ? (
            <FlyingLikeHeart targetRect={flyTarget} onComplete={handleFlyComplete} />
          ) : null}

          <EngagementAction
            label="Izohlar"
            count={commentCount}
            onClick={scrollToComments}
            icon={<MessageCircle className={iosIconClass} aria-hidden />}
          />

          {engagementLoading ? (
            <Skeleton className="h-10 w-20 rounded-full" />
          ) : (
            <EngagementAction
              label={savedByMe ? "Lentadan olib tashlash" : "Lentaga qo'shish"}
              active={savedByMe}
              onClick={() =>
                requireAuth(() => {
                  void toggleSave(articleId);
                })
              }
              icon={
                <Bookmark
                  className={cn(iosIconClass, savedByMe && "fill-current")}
                  aria-hidden
                />
              }
            />
          )}
        </div>

        <Separator />

        <section
          id="comments"
          ref={commentsRef}
          className="space-y-6 scroll-mt-20"
          aria-label="Izohlar"
        >
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Izohlar
          </h2>

          <div className="space-y-3">
            <Textarea
              value={isLoggedIn ? commentText : ""}
              onChange={(event) => setCommentText(event.target.value)}
              onFocus={() => {
                if (mounted && !isLoggedIn) {
                  setLoginOpen(true);
                }
              }}
              readOnly={!isLoggedIn}
              placeholder="Fikringizni yozing..."
              rows={3}
              className={cn(
                "min-h-[88px] resize-none",
                !isLoggedIn && "cursor-pointer",
              )}
              maxLength={2000}
            />
            {isLoggedIn ? (
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  disabled={!commentText.trim() || commentSubmitting}
                  className="rounded-full px-5"
                  onClick={() => void handleSubmitComment()}
                >
                  {commentSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                </Button>
              </div>
            ) : null}
          </div>

          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Hozircha izohlar yo&apos;q. Birinchi bo&apos;lib fikr qoldiring.
            </p>
          ) : (
            <CommentThreadList
              comments={comments}
              articleId={articleId}
              currentUserId={currentUser?.id}
              isLoggedIn={isLoggedIn}
              onRequireAuth={() => setLoginOpen(true)}
              onReply={async (payload) => {
                await createComment(payload).unwrap();
              }}
              onReport={async (payload) => {
                try {
                  await reportComment(payload).unwrap();
                  toast.success("Shikoyat yuborildi");
                } catch {
                  toast.error("Shikoyat yuborilmadi. Qayta urinib ko'ring.");
                }
              }}
              onDelete={async (payload) => {
                await deleteComment(payload).unwrap();
              }}
              onLike={async (payload) => {
                await toggleCommentLike(payload).unwrap();
              }}
              isSubmitting={commentSubmitting}
              isDeleting={commentDeleting}
            />
          )}
        </section>
      </div>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
