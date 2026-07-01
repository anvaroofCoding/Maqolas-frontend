"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  Loader2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { CommentThreadList } from "@/components/articles/comment-thread";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  articleImageProps,
  normalizeArticleImageSrc,
} from "@/lib/images/next-image";
import {
  markWelcomePromoShown,
  shouldShowWelcomePromo,
} from "@/lib/welcome-promo/storage";
import {
  hasCompletedOnboarding,
  ONBOARDING_COMPLETED_EVENT,
} from "@/lib/onboarding/storage";
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

function PromoImage({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) {
  const [imageError, setImageError] = useState(false);
  const src = normalizeArticleImageSrc(imageUrl);

  return (
    <div className="relative h-full min-h-[9rem] w-full overflow-hidden bg-muted sm:min-h-[20rem]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_55%),radial-gradient(ellipse_at_90%_100%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_50%)]"
        aria-hidden
      />

      {!imageError && src ? (
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          {...articleImageProps(src, { priority: true })}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,color-mix(in_oklch,var(--primary)_22%,var(--card)),var(--card))] p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20">
            <Sparkles className="size-7" aria-hidden />
          </div>
          <p className="max-w-[16rem] text-sm font-medium text-foreground/80">
            Maxsus taklif
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5 sm:bg-gradient-to-r sm:from-black/65 sm:via-black/20 sm:to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:hidden">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
          <BadgeCheck className="size-3.5 text-emerald-300" aria-hidden />
          100% kafolatlangan
        </span>
      </div>
    </div>
  );
}

export function WelcomePromoModal() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");
  const isHomepage = pathname === "/";

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
      !silentAuthAttempted ||
      !shouldShowWelcomePromo(promo.id)
    ) {
      return;
    }

    const openPromo = () => {
      setOpen(true);
      markWelcomePromoShown(promo.id);
    };

    if (hasCompletedOnboarding() || !isHomepage) {
      openPromo();
      return;
    }

    const onOnboardingDone = () => {
      window.setTimeout(openPromo, 450);
    };

    window.addEventListener(ONBOARDING_COMPLETED_EVENT, onOnboardingDone);
    return () => {
      window.removeEventListener(ONBOARDING_COMPLETED_EVENT, onOnboardingDone);
    };
  }, [
    mounted,
    isAdminRoute,
    isAuthRoute,
    isHomepage,
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-welcome-promo="true"
          showCloseButton
          className={cn(
            "gap-0 overflow-hidden border-border bg-card p-0 shadow-2xl",
            "top-[50%] left-[50%] w-[calc(100%-1.5rem)] max-w-[calc(100%-1.5rem)]",
            "max-h-[min(92dvh,820px)] translate-x-[-50%] translate-y-[-50%]",
            "sm:max-w-2xl lg:max-w-4xl",
          )}
        >
          <div className="grid max-h-[min(92dvh,820px)] min-h-0 overflow-hidden sm:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]">
            <div className="relative min-h-0">
              <PromoImage imageUrl={promo.imageUrl} title={promo.title} />

              <div className="absolute left-4 top-4 hidden sm:block">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  <BadgeCheck className="size-3.5 text-emerald-300" aria-hidden />
                  Xizmat 100% kafolatlangan
                </span>
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Sparkles className="size-3.5" aria-hidden />
                      Maxsus taklif
                    </div>

                    <DialogTitle className="text-left text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                      {promo.title}
                    </DialogTitle>

                    <DialogDescription className="text-left text-sm leading-relaxed text-muted-foreground">
                      {promo.description}
                    </DialogDescription>
                  </div>

                  {promo.linkUrl && promo.linkLabel ? (
                    <Button
                      asChild
                      size="lg"
                      className="h-11 w-full rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Link
                        href={promo.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {promo.linkLabel}
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  ) : null}

                  <section
                    className="overflow-hidden rounded-2xl border border-border bg-background/80 p-4"
                    aria-label="Reklama izohlari"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MessageCircle className="size-4 text-primary" aria-hidden />
                        Fikrlar
                      </h3>
                      {comments.length > 0 ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {comments.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      {isLoggedIn ? (
                        <>
                          <Textarea
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                            placeholder="Fikringizni yozing..."
                            rows={3}
                            className="min-h-[84px] resize-none rounded-xl border-border/80 bg-card"
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
                        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/25 px-4 py-5 text-center">
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

                    <div className="mt-4 border-t border-border/70 pt-4">
                      {commentsLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="flex gap-3">
                              <Skeleton className="size-8 shrink-0 rounded-full" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-16 w-full rounded-xl" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : comments.length === 0 ? (
                        <p className="py-3 text-center text-sm text-muted-foreground">
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
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
