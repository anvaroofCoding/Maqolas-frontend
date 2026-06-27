"use client";

import { ArrowLeft, Heart, MessageCircle, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { PinCommentSection } from "@/components/pins/pin-comment-section";
import { PinRelatedGrid } from "@/components/pins/pin-related-grid";
import { PinShareButton } from "@/components/pins/pin-share-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useGetPinCommentsQuery,
  useGetPinEngagementQuery,
  useTogglePinLikeMutation,
} from "@/features/pins/api/pins-api";
import type { PinSummary } from "@/features/pins/types";
import { formatCount } from "@/lib/format";
import {
  articleImageProps,
  normalizeArticleImageSrc,
} from "@/lib/images/next-image";
import { getUserInitials } from "@/lib/user";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

type PinDetailViewProps = {
  pin: PinSummary;
  relatedPins: PinSummary[];
};

function getPinImageDimensions(pin: PinSummary) {
  const width = pin.width && pin.width > 0 ? pin.width : 1200;
  const height = pin.height && pin.height > 0 ? pin.height : 1500;
  return { width, height };
}

export function PinDetailView({ pin, relatedPins }: PinDetailViewProps) {
  const router = useRouter();
  const mediaRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const imageSrc = normalizeArticleImageSrc(pin.imageUrl);
  const imageProps = articleImageProps(imageSrc, { priority: true });
  const { width: imageWidth, height: imageHeight } = getPinImageDimensions(pin);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const media = mediaRef.current;
    if (!media) return;

    const syncPanelHeight = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      setPanelHeight(isDesktop ? media.offsetHeight : null);
    };

    const observer = new ResizeObserver(syncPanelHeight);
    observer.observe(media);
    window.addEventListener("resize", syncPanelHeight);
    syncPanelHeight();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncPanelHeight);
    };
  }, [mounted, imageSrc, pin.slug]);

  const { data: engagementData } = useGetPinEngagementQuery(pin.id, {
    skip: !mounted,
  });
  const { data: commentsData } = useGetPinCommentsQuery(
    { pinId: pin.id },
    { skip: !mounted },
  );
  const [toggleLike] = useTogglePinLikeMutation();

  const likeCount = engagementData?.likeCount ?? pin.likeCount;
  const commentCount = engagementData?.commentCount ?? pin.commentCount;
  const likedByMe = engagementData?.likedByMe ?? pin.likedByMe ?? false;

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    action();
  };

  const scrollToComments = () => {
    setCommentsOpen(true);
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="pin-detail-shell w-full min-w-0 pb-24 lg:pb-8">
        <div className="pin-detail-grid w-full min-w-0">
          <div ref={mediaRef} className="pin-detail-media relative min-w-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-3 top-3 z-20 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-md transition-transform active:scale-95 sm:size-11"
              aria-label="Orqaga"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>

            <figure className="pin-detail-figure flex min-h-0 w-full min-w-0 items-start justify-center overflow-hidden rounded-2xl bg-muted/25 sm:rounded-[24px]">
              <Image
                src={imageSrc}
                alt={pin.title}
                width={imageWidth}
                height={imageHeight}
                sizes="(max-width: 1024px) 100vw, min(65vw, 900px)"
                className="pin-detail-image h-auto max-h-[min(78vh,920px)] w-auto max-w-full object-contain"
                {...imageProps}
              />
              <figcaption className="sr-only">{pin.title}</figcaption>
            </figure>
          </div>

          <aside className="pin-detail-panel flex min-h-0 min-w-0 flex-col lg:self-start">
            <div
              className="pin-detail-panel-card flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
              style={panelHeight != null ? { height: panelHeight } : undefined}
            >
              <div className="shrink-0 border-b border-border/60 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-10 rounded-full px-3",
                        likedByMe && "text-rose-500 hover:text-rose-500",
                      )}
                      aria-label="Yoqtirish"
                      aria-pressed={likedByMe}
                      onClick={() =>
                        requireAuth(() => {
                          void toggleLike(pin.id);
                        })
                      }
                    >
                      <Heart
                        className={cn("size-[18px]", likedByMe && "fill-current")}
                        aria-hidden
                      />
                      <span className="tabular-nums">{formatCount(likeCount)}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-10 rounded-full px-3"
                      aria-label="Izohlar"
                      onClick={scrollToComments}
                    >
                      <MessageCircle className="size-[18px]" aria-hidden />
                      <span className="tabular-nums">
                        {formatCount(commentCount)}
                      </span>
                    </Button>

                    <PinShareButton
                      slug={pin.slug}
                      title={pin.title}
                      imageUrl={imageSrc}
                    />
                  </div>

                  <Button asChild className="hidden shrink-0 rounded-full px-5 sm:inline-flex">
                    <Link href="/rasm/yuklash">
                      <PlusIcon className="size-4" aria-hidden />
                      Yuklash
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="pin-detail-panel-scroll min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
              {pin.author ? (
                <div className="flex items-center gap-3">
                  <Avatar size="default">
                    {pin.author.avatarUrl ? (
                      <AvatarImage
                        src={pin.author.avatarUrl}
                        alt={pin.author.displayName}
                      />
                    ) : null}
                    <AvatarFallback>
                      {getUserInitials(pin.author.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    {pin.author.username ? (
                      <Link
                        href={`/profil/${pin.author.username}`}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {pin.author.displayName}
                      </Link>
                    ) : (
                      <p className="font-semibold text-foreground">
                        {pin.author.displayName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Muallif</p>
                  </div>
                </div>
              ) : null}

              <h1 className="line-clamp-3 text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl" title={pin.title}>
                {pin.title}
              </h1>

              {pin.description ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tavsif
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {pin.description}
                  </p>
                </div>
              ) : null}

              <section ref={commentsRef} className="border-t border-border/60 pt-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-1 text-left"
                  onClick={() => setCommentsOpen((open) => !open)}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {formatCount(commentCount)} ta izoh
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {commentsOpen ? "Yashirish" : "Ko'rsatish"}
                  </span>
                </button>

                {commentsOpen ? (
                  <div className="mt-3">
                    <PinCommentSection
                      pinId={pin.id}
                      comments={commentsData?.comments ?? []}
                      onRequireAuth={() => setLoginOpen(true)}
                      compact
                    />
                  </div>
                ) : null}
              </section>
              </div>
            </div>
          </aside>

          {relatedPins.length > 0 ? (
            <section className="pin-detail-related min-w-0 pt-2 lg:pt-4">
              <h2 className="mb-3 text-base font-bold text-foreground sm:text-lg">
                Boshqa qiziqarli rasmlar
              </h2>
              <PinRelatedGrid pins={relatedPins} />
            </section>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-2 backdrop-blur-md lg:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg items-center justify-around gap-2">
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "h-11 flex-1 rounded-full",
              likedByMe && "text-rose-500",
            )}
            onClick={() =>
              requireAuth(() => {
                void toggleLike(pin.id);
              })
            }
          >
            <Heart
              className={cn("mr-2 size-5", likedByMe && "fill-current")}
              aria-hidden
            />
            {formatCount(likeCount)}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-11 flex-1 rounded-full"
            onClick={scrollToComments}
          >
            <MessageCircle className="mr-2 size-5" aria-hidden />
            {formatCount(commentCount)}
          </Button>

          <PinShareButton
            slug={pin.slug}
            title={pin.title}
            imageUrl={imageSrc}
            className="h-11 flex-1 rounded-full"
          />
        </div>
      </div>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
