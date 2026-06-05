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

function getScrollTop() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function getMaxScrollTop() {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
  const clientHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return Math.max(0, scrollHeight - clientHeight);
}

function scrollPageBy(delta: number) {
  const scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    scrollingElement.scrollTop += delta;
    return;
  }

  window.scrollBy({ top: delta, left: 0, behavior: "auto" });
}

type ArticleAutoScrollButtonProps = {
  disabled?: boolean;
};

export function ArticleAutoScrollButton({
  disabled = false,
}: ArticleAutoScrollButtonProps) {
  const [active, setActive] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const speedRef = useRef<number>(SCROLL_SPEED_LEVELS[0].pxPerSecond);

  const currentSpeed = SCROLL_SPEED_LEVELS[speedIndex];

  const stopScrolling = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastFrameTimeRef.current = null;
  }, []);

  const scrollStep = useCallback(
    (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsedMs = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      const maxScrollTop = getMaxScrollTop();
      const currentScrollTop = getScrollTop();

      if (currentScrollTop >= maxScrollTop - 1) {
        setActive(false);
        stopScrolling();
        return;
      }

      const delta = (speedRef.current * elapsedMs) / 1000;
      if (delta > 0) {
        scrollPageBy(delta);
      }

      frameRef.current = requestAnimationFrame(scrollStep);
    },
    [stopScrolling],
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

    frameRef.current = requestAnimationFrame(scrollStep);
    return stopScrolling;
  }, [active, disabled, scrollStep, stopScrolling]);

  useEffect(() => {
    if (!active) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActive(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active]);

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
