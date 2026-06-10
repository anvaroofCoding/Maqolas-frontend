"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const PX_PER_SECOND = 28;

function isDocumentScroller(element: HTMLElement) {
  return (
    element === document.documentElement ||
    element === document.body ||
    element === document.scrollingElement
  );
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
  if (isDocumentScroller(container)) {
    window.scrollBy(0, delta);
    return;
  }
  container.scrollTop += delta;
}

type UseAutoScrollOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onComplete?: () => void;
  speedPxPerSecond?: number;
  startDelayMs?: number;
};

export function useAutoScroll({
  active,
  containerRef,
  onComplete,
  speedPxPerSecond = PX_PER_SECOND,
  startDelayMs = 0,
}: UseAutoScrollOptions) {
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollingRef = useRef(false);

  const stopScrolling = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastFrameTimeRef.current = null;
    scrollingRef.current = false;
  }, []);

  const scrollStep = useCallback(
    (timestamp: number) => {
      const container = containerRef.current;
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
        stopScrolling();
        onComplete?.();
        return;
      }

      const delta = (speedPxPerSecond * elapsedMs) / 1000;
      if (delta > 0) {
        scrollContainerBy(container, delta);
      }

      frameRef.current = requestAnimationFrame(scrollStep);
    },
    [containerRef, onComplete, speedPxPerSecond, stopScrolling],
  );

  useEffect(() => {
    if (!active) {
      stopScrolling();
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      return;
    }

    const start = () => {
      scrollingRef.current = true;
      lastFrameTimeRef.current = null;
      frameRef.current = requestAnimationFrame(scrollStep);
    };

    if (startDelayMs > 0) {
      delayTimerRef.current = setTimeout(start, startDelayMs);
    } else {
      start();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stopScrolling();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopScrolling();
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active, startDelayMs, scrollStep, stopScrolling]);

  return { stopScrolling };
}
