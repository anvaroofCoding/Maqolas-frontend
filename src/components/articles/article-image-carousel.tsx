"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { articleImageProps, normalizeArticleImageSrc } from "@/lib/images/next-image";
import { cn } from "@/lib/utils";

type ArticleImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  intervalMs?: number;
  showDots?: boolean;
  compactDots?: boolean;
  autoPlay?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

const SWIPE_THRESHOLD_PX = 36;

export function ArticleImageCarousel({
  images,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  intervalMs = 3000,
  showDots = true,
  compactDots = false,
  autoPlay = true,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: ArticleImageCarouselProps) {
  const uniqueImages = useMemo(
    () => Array.from(new Set(images.filter(Boolean))),
    [images],
  );
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!autoPlay);
  const activeIndex = controlledIndex ?? uncontrolledIndex;
  const rootRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const isPaused = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      const normalized =
        ((nextIndex % uniqueImages.length) + uniqueImages.length) %
        uniqueImages.length;

      if (onActiveIndexChange) {
        onActiveIndexChange(normalized);
        return;
      }

      setUncontrolledIndex(normalized);
    },
    [onActiveIndexChange, uniqueImages.length],
  );

  useEffect(() => {
    if (controlledIndex === undefined) {
      setUncontrolledIndex(0);
    }
  }, [controlledIndex, uniqueImages.join("|")]);

  useEffect(() => {
    if (!autoPlay || uniqueImages.length <= 1) return;

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin: "120px", threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlay, uniqueImages.length]);

  useEffect(() => {
    if (!autoPlay || uniqueImages.length <= 1 || !isVisible) return;

    const interval = window.setInterval(() => {
      if (isPaused.current) return;

      if (onActiveIndexChange) {
        onActiveIndexChange(
          ((controlledIndex ?? 0) + 1) % uniqueImages.length,
        );
        return;
      }

      setUncontrolledIndex(
        (current) => (current + 1) % uniqueImages.length,
      );
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [
    autoPlay,
    controlledIndex,
    intervalMs,
    isVisible,
    onActiveIndexChange,
    uniqueImages.length,
  ]);

  useEffect(
    () => () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    },
    [],
  );

  const pauseAutoPlay = useCallback(() => {
    isPaused.current = true;
  }, []);

  const resumeAutoPlay = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      isPaused.current = false;
      resumeTimeoutRef.current = null;
    }, intervalMs);
  }, [intervalMs]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (uniqueImages.length <= 1) return;
      dragStartX.current = event.clientX;
      pauseAutoPlay();
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [pauseAutoPlay, uniqueImages.length],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (uniqueImages.length <= 1 || dragStartX.current === null) return;

      const deltaX = event.clientX - dragStartX.current;
      dragStartX.current = null;

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex(activeIndex + (deltaX < 0 ? 1 : -1));
      }

      resumeAutoPlay();
    },
    [activeIndex, resumeAutoPlay, setActiveIndex, uniqueImages.length],
  );

  const handlePointerCancel = useCallback(() => {
    dragStartX.current = null;
    resumeAutoPlay();
  }, [resumeAutoPlay]);

  if (uniqueImages.length === 0) {
    return (
      <div
        className={cn(
          "h-full w-full bg-gradient-to-br from-primary/25 via-primary/10 to-muted",
          className,
        )}
      />
    );
  }

  if (uniqueImages.length === 1) {
    const imageSrc = normalizeArticleImageSrc(uniqueImages[0]);

    return (
      <div
        ref={rootRef}
        className={cn("relative h-full w-full overflow-hidden", className)}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
          {...articleImageProps(imageSrc, { priority })}
        />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative h-full w-full overflow-hidden touch-pan-y", className)}
      aria-label="Maqola rasmlari"
      aria-roledescription="karusel"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      onTouchStart={pauseAutoPlay}
      onTouchEnd={resumeAutoPlay}
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {uniqueImages.map((src, index) => {
          const imageSrc = normalizeArticleImageSrc(src);

          return (
          <div key={`${imageSrc}-${index}`} className="relative h-full min-w-full shrink-0">
            <Image
              src={imageSrc}
              alt={`${alt} (${index + 1}/${uniqueImages.length})`}
              fill
              sizes={sizes}
              className={cn("object-cover", imageClassName)}
              draggable={false}
              {...articleImageProps(imageSrc, {
                priority: priority && index === 0,
              })}
            />
          </div>
          );
        })}
      </div>

      {showDots ? (
        <div
          className={cn(
            "absolute left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full bg-black/35 backdrop-blur-sm",
            compactDots
              ? "bottom-1 gap-1 px-1.5 py-0.5"
              : "bottom-2 gap-1.5 px-2 py-1",
          )}
        >
          {uniqueImages.map((src, index) => (
            <button
              key={`${src}-dot-${index}`}
              type="button"
              aria-label={`${index + 1}-rasmga o'tish`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={cn(
                "rounded-full transition-all",
                compactDots ? "size-1" : "size-1.5",
                activeIndex === index ? "bg-white" : "bg-white/45",
              )}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActiveIndex(index);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
