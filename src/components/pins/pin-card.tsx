"use client";

import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { PinShareButton } from "@/components/pins/pin-share-button";
import type { PinSummary } from "@/features/pins/types";
import { useTogglePinLikeMutation } from "@/features/pins/api/pins-api";
import { formatCount } from "@/lib/format";
import {
  articleImageProps,
  normalizeArticleImageSrc,
} from "@/lib/images/next-image";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

type PinCardProps = {
  pin: PinSummary;
  priority?: boolean;
  variant?: "default" | "compact";
};

export function PinCard({
  pin,
  priority = false,
  variant = "default",
}: PinCardProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [liked, setLiked] = useState(pin.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(pin.likeCount);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [toggleLike] = useTogglePinLikeMutation();

  const imageSrc = normalizeArticleImageSrc(pin.imageUrl);
  const aspectRatio =
    pin.width && pin.height && pin.height > 0
      ? pin.width / pin.height
      : variant === "compact"
        ? 3 / 4
        : 4 / 5;

  const handleLike = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));

    try {
      const result = await toggleLike(pin.id).unwrap();
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch {
      setLiked(liked);
      setLikeCount(pin.likeCount);
    }
  };

  return (
    <>
      <article className="pin-card mb-3 break-inside-avoid sm:mb-4">
        <Link
          href={`/rasm/${pin.slug}`}
          className="pin-card-link group relative block touch-manipulation overflow-hidden rounded-[16px] bg-muted/30 sm:rounded-[20px]"
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio }}
          >
            <Image
              src={imageSrc}
              alt={pin.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03] group-active:scale-[0.99]"
              {...articleImageProps(imageSrc, { priority })}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35 opacity-100 transition-opacity duration-300 sm:from-black/20 sm:to-black/55 sm:opacity-0 sm:group-hover:opacity-100" />

            <div className="absolute inset-x-0 top-0 flex items-start gap-2 p-2.5 sm:p-3">
              <span
                className="pointer-events-none min-w-0 flex-1 truncate rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100"
                title={pin.title}
              >
                {pin.title}
              </span>

              <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={handleLike}
                  aria-label="Yoqtirish"
                  aria-pressed={liked}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60 active:scale-95",
                    liked && "text-rose-300",
                  )}
                >
                  <Heart
                    className={cn("size-4", liked && "fill-current")}
                    aria-hidden
                  />
                </button>

                <PinShareButton
                  slug={pin.slug}
                  title={pin.title}
                  imageUrl={imageSrc}
                  variant="overlay"
                  className="active:scale-95"
                />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 sm:p-3">
              <div className="min-w-0 flex-1 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
                {variant === "default" && pin.author?.displayName ? (
                  <p className="truncate text-[11px] font-medium text-white/90 sm:text-xs">
                    {pin.author.displayName}
                  </p>
                ) : null}
                <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-white sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3.5" aria-hidden />
                    {formatCount(likeCount)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="size-3.5" aria-hidden />
                    {formatCount(pin.commentCount)}
                  </span>
                </div>
              </div>

              <span className="pointer-events-none inline-flex shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm sm:opacity-0 sm:transition-all sm:duration-200 sm:group-hover:opacity-100">
                Ko&apos;rish
              </span>
            </div>
          </div>
        </Link>
      </article>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
