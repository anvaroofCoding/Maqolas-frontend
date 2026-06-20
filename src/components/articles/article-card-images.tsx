"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const ROTATE_INTERVAL_MS = 3000;

type CarouselContextValue = {
  images: string[];
  alt: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function CarouselFrame({
  className,
  imageSizes,
  showDots,
}: {
  className?: string;
  imageSizes: string;
  showDots: boolean;
}) {
  const carousel = useContext(CarouselContext);
  if (!carousel) return null;

  const { images, alt, activeIndex, setActiveIndex } = carousel;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border bg-muted",
        className,
      )}
      aria-label={images.length > 1 ? "Maqola rasmlari" : undefined}
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="relative h-full min-w-full shrink-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={imageSizes}
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>

      {showDots && images.length > 1 ? (
        <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/35 px-1.5 py-0.5 backdrop-blur-sm">
          {images.map((src, index) => (
            <button
              key={`${src}-dot-${index}`}
              type="button"
              aria-label={`${index + 1}-rasmga o'tish`}
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

type ArticleCardImageCarouselProps = {
  images: string[];
  alt: string;
  children: ReactNode;
};

export function ArticleCardImageCarousel({
  images,
  alt,
  children,
}: ArticleCardImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images.join("|")]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <>{children}</>;
  }

  return (
    <CarouselContext.Provider
      value={{ images, alt, activeIndex, setActiveIndex }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export function ArticleCardGalleryThumbnail() {
  const carousel = useContext(CarouselContext);
  if (!carousel) return null;

  return (
    <CarouselFrame
      imageSizes="144px"
      showDots={carousel.images.length > 1}
      className="hidden h-24 w-32 sm:block sm:h-28 sm:w-36"
    />
  );
}

export function ArticleCardGalleryHero() {
  const carousel = useContext(CarouselContext);
  if (!carousel) return null;

  return (
    <CarouselFrame
      imageSizes="100vw"
      showDots={carousel.images.length > 1}
      className="mt-4 h-40 w-full sm:hidden"
    />
  );
}
