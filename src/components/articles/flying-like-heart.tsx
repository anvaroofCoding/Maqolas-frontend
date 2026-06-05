"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const iosIconClass = "size-[22px] stroke-[1.75]";

type FlyingLikeHeartProps = {
  targetRect: DOMRect;
  onComplete: () => void;
};

export function FlyingLikeHeart({ targetRect, onComplete }: FlyingLikeHeartProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => setPortalRoot(document.body), []);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timer = window.setTimeout(handleComplete, 680);
    return () => window.clearTimeout(timer);
  }, [handleComplete]);

  if (!portalRoot) return null;

  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;
  const startX = window.innerWidth + 56;
  const dx = endX - startX;

  return createPortal(
    <div
      className="like-heart-fly pointer-events-none fixed z-[120]"
      style={{
        left: startX,
        top: endY,
        ["--like-dx" as string]: `${dx}px`,
        ["--like-arc" as string]: "-12px",
      }}
      aria-hidden
    >
      <Heart
        className={`${iosIconClass} fill-nav-active text-nav-active drop-shadow-[0_8px_18px_color-mix(in_oklch,var(--nav-active)_40%,transparent)]`}
      />
    </div>,
    portalRoot,
  );
}

export { iosIconClass };
