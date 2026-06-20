"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
};

export function ArticleImageCarousel({
  images,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  intervalMs = 3000,
  showDots = true,
}: ArticleImageCarouselProps) {
  const uniqueImages = useMemo(
    () => Array.from(new Set(images.filter(Boolean))),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [uniqueImages.join("|")]);

  useEffect(() => {
    if (uniqueImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % uniqueImages.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, uniqueImages.length]);

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
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        <Image
          src={uniqueImages[0]}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {uniqueImages.map((src, index) => (
          <div key={`${src}-${index}`} className="relative h-full min-w-full shrink-0">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority && index === 0}
              sizes={sizes}
              className={cn("object-cover", imageClassName)}
              unoptimized
            />
          </div>
        ))}
      </div>

      {showDots ? (
        <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
          {uniqueImages.map((src, index) => (
            <button
              key={`${src}-dot-${index}`}
              type="button"
              aria-label={`${index + 1}-rasm`}
              className={cn(
                "size-1.5 rounded-full transition-all",
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
