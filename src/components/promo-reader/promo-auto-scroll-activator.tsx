"use client";

import { ChevronsDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { consumePromoAutoScroll } from "@/lib/promo-reader/storage";

export function PromoAutoScrollActivator() {
  const [active, setActive] = useState(false);
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    scrollRef.current = document.documentElement;
    if (consumePromoAutoScroll()) {
      window.scrollTo({ top: 0, behavior: "instant" });
      setActive(true);
    }
  }, []);

  useAutoScroll({
    active,
    containerRef: scrollRef,
    startDelayMs: 700,
    onComplete: () => setActive(false),
  });

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center md:bottom-8">
      <Badge
        variant="secondary"
        className="gap-1.5 rounded-full bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-sm"
      >
        <ChevronsDownIcon className="size-3.5 animate-pulse" />
        Avto-o&apos;qish 1x
      </Badge>
    </div>
  );
}
