"use client";

import { BadgeCheck, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { CommentThreadList } from "@/components/articles/comment-thread";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import type { ArticleComment } from "@/features/articles/types";
import {
  useCreateWelcomePromoCommentMutation,
  useDeleteWelcomePromoCommentMutation,
  useGetActiveWelcomePromoQuery,
  useGetWelcomePromoCommentsQuery,
  useToggleWelcomePromoCommentLikeMutation,
} from "@/features/welcome-promo/api/welcome-promo-api";
import type { WelcomePromoComment } from "@/features/welcome-promo/types";
import {
  markWelcomePromoShown,
  shouldShowWelcomePromo,
} from "@/lib/welcome-promo/storage";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function toArticleComments(comments: WelcomePromoComment[]): ArticleComment[] {
  return comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    parentId: comment.parentId,
    likeCount: comment.likeCount,
    likedByMe: comment.likedByMe,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: comment.author,
    replies: comment.replies ? toArticleComments(comment.replies) : undefined,
  }));
}

export function WelcomePromoModal() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useGetActiveWelcomePromoQuery(undefined, {
    skip: !mounted || isAdminRoute || isAuthRoute,
  });

  const promo = data?.promo ?? null;

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const silentAuthAttempted = useAppSelector(
    (state) => state.auth.silentAuthAttempted,
  );

  useEffect(() => {
    if (
      !mounted ||
      isAdminRoute ||
      isAuthRoute ||
      isLoading ||
      !promo ||
      !silentAuthAttempted
    ) {
      return;
    }

    if (shouldShowWelcomePromo(promo.id)) {
      setOpen(true);
      markWelcomePromoShown(promo.id);
    }
  }, [
    mounted,
    isAdminRoute,
    isAuthRoute,
    isLoading,
    promo,
    silentAuthAttempted,
  ]);

  const isLoggedIn = mounted && (isAuthenticated || Boolean(accessToken));

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });
  const currentUser = meData?.user ?? authUser;

  const { data: commentsData, isLoading: commentsLoading } =
    useGetWelcomePromoCommentsQuery(
      { promoId: promo?.id ?? "" },
      { skip: !open || !promo?.id },
    );
  const [createComment, { isLoading: commentSubmitting }] =
    useCreateWelcomePromoCommentMutation();
  const [deleteComment, { isLoading: commentDeleting }] =
    useDeleteWelcomePromoCommentMutation();
  const [toggleCommentLike] = useToggleWelcomePromoCommentLikeMutation();

  const comments = commentsData?.comments ?? [];

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const handleSubmitComment = () => {
    const content = commentText.trim();
    if (!content || !promo) return;

    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    void (async () => {
      try {
        const result = await createComment({ promoId: promo.id, content }).unwrap();
        setCommentText("");
        if (result.pending) {
          toast.info(
            "Izohingiz moderatsiyaga yuborildi. Tasdiqlangandan keyin ko'rinadi.",
          );
        }
      } catch {
        // keep draft on failure
      }
    })();
  };

  if (!mounted || isAdminRoute || isAuthRoute || isLoading || !promo) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[min(90vh,820px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <div className="min-w-0 overflow-y-auto overflow-x-hidden">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <Image
                src={promo.imageUrl}
                alt={promo.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>

            <div className="space-y-4 p-6">
              <DialogHeader className="space-y-3 text-left">
                <Badge
                  variant="secondary"
                  className="w-fit gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-300"
                >
                  <BadgeCheck className="size-3.5" />
                  Xizmat 100% kafolatlangan
                </Badge>
                <DialogTitle className="text-xl leading-snug">
                  {promo.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-foreground/80">
                  {promo.description}
                </DialogDescription>
              </DialogHeader>

              {promo.linkUrl && promo.linkLabel ? (
                <>
                  <Button
                    asChild
                    className="w-full rounded-full"
                    size="sm"
                  >
                    <Link
                      href={promo.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      {promo.linkLabel}
                    </Link>
                  </Button>
                  <Separator />
                </>
              ) : null}

              <section
                className="min-w-0 space-y-4 overflow-hidden"
                aria-label="Reklama izohlari"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  Fikrlar
                </h3>

                <div className="space-y-3">
                  {isLoggedIn ? (
                    <>
                      <Textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Fikringizni yozing..."
                        rows={3}
                        className="min-h-[80px] resize-none"
                        maxLength={2000}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          disabled={!commentText.trim() || commentSubmitting}
                          className="rounded-full px-5"
                          onClick={() => void handleSubmitComment()}
                        >
                          {commentSubmitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Yuborilmoqda...
                            </>
                          ) : (
                            "Yuborish"
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div
                      className={cn(
                        "flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-md",
                        "border border-dashed border-border bg-muted/30 px-4 py-5 text-center",
                      )}
                    >
                      <p className="text-sm text-muted-foreground">
                        Izoh qoldirish uchun avval kiring
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setLoginOpen(true)}
                      >
                        Google bilan kirish
                      </Button>
                    </div>
                  )}
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
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    Hozircha izohlar yo&apos;q. Birinchi bo&apos;lib fikr
                    qoldiring.
                  </p>
                ) : (
                  <CommentThreadList
                    comments={toArticleComments(comments)}
                    articleId={promo.id}
                    currentUserId={currentUser?.id}
                    isLoggedIn={isLoggedIn}
                    onRequireAuth={() => setLoginOpen(true)}
                    onReply={async (payload) => {
                      try {
                        const result = await createComment({
                          promoId: promo.id,
                          content: payload.content,
                          parentId: payload.parentId,
                        }).unwrap();
                        if (result.pending) {
                          toast.info(
                            "Javobingiz moderatsiyaga yuborildi. Tasdiqlangandan keyin ko'rinadi.",
                          );
                        }
                      } catch {
                        toast.error("Javob yuborilmadi. Qayta urinib ko'ring.");
                      }
                    }}
                    onReport={async () => {
                      toast.info("Shikoyat funksiyasi tez orada qo'shiladi.");
                    }}
                    onDelete={async (payload) => {
                      await deleteComment({
                        promoId: promo.id,
                        commentId: payload.commentId,
                      }).unwrap();
                    }}
                    onLike={async (payload) => {
                      await toggleCommentLike({
                        promoId: promo.id,
                        commentId: payload.commentId,
                      }).unwrap();
                    }}
                    isSubmitting={commentSubmitting}
                    isDeleting={commentDeleting}
                  />
                )}
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
