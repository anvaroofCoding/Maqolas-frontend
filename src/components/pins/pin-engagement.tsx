"use client";

import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { PinCommentSection } from "@/components/pins/pin-comment-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useGetPinCommentsQuery,
  useGetPinEngagementQuery,
  useTogglePinLikeMutation,
} from "@/features/pins/api/pins-api";
import type { PinSummary } from "@/features/pins/types";
import { formatCount } from "@/lib/format";
import { getUserInitials } from "@/lib/user";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

type PinEngagementProps = {
  pin: PinSummary;
};

function ActionButton({
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
        "h-10 gap-2 rounded-full px-3 font-normal text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        active && "text-rose-500 hover:text-rose-500",
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

export function PinEngagement({ pin }: PinEngagementProps) {
  const commentsRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => setMounted(true), []);

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
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="space-y-4">
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
                  className="font-medium text-foreground hover:text-primary"
                >
                  {pin.author.displayName}
                </Link>
              ) : (
                <p className="font-medium text-foreground">
                  {pin.author.displayName}
                </p>
              )}
              <p className="text-xs text-muted-foreground">Muallif</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-border/60 bg-card px-2 py-1 shadow-sm">
          <ActionButton
            label="Yoqtirish"
            count={likeCount}
            active={likedByMe}
            onClick={() =>
              requireAuth(() => {
                void toggleLike(pin.id);
              })
            }
            icon={
              <Heart
                className={cn("size-[18px]", likedByMe && "fill-current")}
                aria-hidden
              />
            }
          />
          <ActionButton
            label="Izohlar"
            count={commentCount}
            onClick={scrollToComments}
            icon={<MessageCircle className="size-[18px]" aria-hidden />}
          />
        </div>

        {pin.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {pin.description}
          </p>
        ) : null}

        <Separator />

        <PinCommentSection
          ref={commentsRef}
          pinId={pin.id}
          comments={commentsData?.comments ?? []}
          onRequireAuth={() => setLoginOpen(true)}
        />
      </section>

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
