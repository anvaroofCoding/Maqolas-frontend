"use client";

import { ThumbsUp } from "lucide-react";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

type TopicSupportButtonProps = {
  likeCount: number;
  likedByMe?: boolean;
  disabled?: boolean;
  size?: "default" | "compact";
  onClick: () => void;
};

export function TopicSupportButton({
  likeCount,
  likedByMe = false,
  disabled = false,
  size = "default",
  onClick,
}: TopicSupportButtonProps) {
  const isCompact = size === "compact";
  const isActive = likedByMe || likeCount > 0;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label="Qo'llab-quvvatlash"
      aria-pressed={likedByMe}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 flex-col items-center justify-center rounded-full border transition-colors",
        isCompact ? "min-w-10 gap-0.5 px-1 py-1.5" : "size-12 gap-0.5",
        isActive
          ? "border-nav-active/45 bg-nav-active/8 text-nav-active"
          : "border-border text-muted-foreground hover:border-nav-active/35 hover:bg-nav-active/5 hover:text-nav-active",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <ThumbsUp
        className={cn(
          isCompact ? "size-3.5" : "size-4",
          likedByMe && "fill-nav-active text-nav-active",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "font-semibold tabular-nums",
          isCompact ? "text-xs" : "text-sm",
        )}
      >
        {formatCount(likeCount)}
      </span>
    </button>
  );
}
