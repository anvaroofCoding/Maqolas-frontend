"use client";

import { ChevronsDownIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCROLL_SPEED_LEVELS = [
  { label: "1x", pxPerSecond: 28 },
  { label: "1.5x", pxPerSecond: 42 },
  { label: "2x", pxPerSecond: 56 },
  { label: "3x", pxPerSecond: 84 },
] as const;

function isDocumentScroller(element: HTMLElement) {
  return (
    element === document.documentElement ||
    element === document.body ||
    element === document.scrollingElement
  );
}

function findScrollContainer(anchor: HTMLElement | null): HTMLElement {
  if (typeof window === "undefined" || !anchor) {
    return document.documentElement;
  }

  let current: HTMLElement | null = anchor.parentElement;

  while (current) {
    const { overflowY } = window.getComputedStyle(current);
    const canScroll =
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay";

    if (canScroll && current.scrollHeight > current.clientHeight + 1) {
      return current;
    }

    current = current.parentElement;
  }

  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
}

function getScrollTop(container: HTMLElement) {
  if (isDocumentScroller(container)) {
    return (
      window.scrollY ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0
    );
  }

  return container.scrollTop;
}

function getMaxScrollTop(container: HTMLElement) {
  if (isDocumentScroller(container)) {
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    const clientHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return Math.max(0, scrollHeight - clientHeight);
  }

  return Math.max(0, container.scrollHeight - container.clientHeight);
}

function scrollContainerBy(container: HTMLElement, delta: number) {
  container.scrollTop += delta;
}

type ArticleAutoScrollButtonProps = {
  disabled?: boolean;
};

export function ArticleAutoScrollButton({
  disabled = false,
}: ArticleAutoScrollButtonProps) {
  const [active, setActive] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const speedRef = useRef<number>(SCROLL_SPEED_LEVELS[0].pxPerSecond);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const currentSpeed = SCROLL_SPEED_LEVELS[speedIndex];

  const resolveScrollContainer = useCallback(() => {
    scrollContainerRef.current = findScrollContainer(anchorRef.current);
  }, []);

  const stopScrolling = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastFrameTimeRef.current = null;
    scrollContainerRef.current = null;
  }, []);

  const scrollStep = useCallback(
    (timestamp: number) => {
      if (!scrollContainerRef.current) {
        resolveScrollContainer();
      }

      const container = scrollContainerRef.current;
      if (!container) {
        frameRef.current = requestAnimationFrame(scrollStep);
        return;
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsedMs = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      const maxScrollTop = getMaxScrollTop(container);
      const currentScrollTop = getScrollTop(container);

      if (currentScrollTop >= maxScrollTop - 1) {
        setActive(false);
        stopScrolling();
        return;
      }

      const delta = (speedRef.current * elapsedMs) / 1000;
      if (delta > 0) {
        scrollContainerBy(container, delta);
      }

      frameRef.current = requestAnimationFrame(scrollStep);
    },
    [resolveScrollContainer, stopScrolling],
  );

  const cycleSpeed = useCallback(() => {
    setSpeedIndex((previous) => {
      const nextIndex = (previous + 1) % SCROLL_SPEED_LEVELS.length;
      speedRef.current = SCROLL_SPEED_LEVELS[nextIndex].pxPerSecond;
      return nextIndex;
    });
  }, []);

  useEffect(() => {
    speedRef.current = SCROLL_SPEED_LEVELS[speedIndex].pxPerSecond;
  }, [speedIndex]);

  useEffect(() => {
    if (!active || disabled) {
      stopScrolling();
      return;
    }

    resolveScrollContainer();
    frameRef.current = requestAnimationFrame(scrollStep);
    return stopScrolling;
  }, [active, disabled, resolveScrollContainer, scrollStep, stopScrolling]);

  useEffect(() => {
    if (!active) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActive(false);
      }
    };

    const handleResize = () => {
      resolveScrollContainer();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, resolveScrollContainer]);

  useEffect(() => {
    if (disabled && active) {
      setActive(false);
    }
  }, [active, disabled]);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-10 min-w-10 rounded-full px-2.5 text-xs font-semibold"
        aria-label={`Scroll tezligi: ${currentSpeed.label}. Bosib tezlikni oshiring`}
        disabled={disabled}
        onClick={cycleSpeed}
      >
        {currentSpeed.label}
      </Button>

      <Button
        ref={anchorRef}
        type="button"
        size="icon"
        variant={active ? "default" : "outline"}
        className={cn(
          "size-10 rounded-full",
          active &&
            "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground",
        )}
        aria-label={active ? "Avto-scrollni o'chirish" : "Avto-scrollni yoqish"}
        aria-pressed={active}
        disabled={disabled}
        onClick={() => setActive((previous) => !previous)}
      >
        <ChevronsDownIcon
          className={cn("size-4", active && "animate-pulse")}
          aria-hidden
        />
      </Button>
    </>
  );
}
