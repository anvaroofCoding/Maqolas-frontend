"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ArticleImageCarousel } from "@/components/articles/article-image-carousel";

type CarouselContextValue = {
  images: string[];
  alt: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

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
    }, 3000);

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
    <ArticleImageCarousel
      images={carousel.images}
      alt={carousel.alt}
      activeIndex={carousel.activeIndex}
      onActiveIndexChange={carousel.setActiveIndex}
      autoPlay={false}
      sizes="112px"
      compactDots={carousel.images.length > 1}
      className="hidden h-16 w-20 shrink-0 rounded-lg border bg-muted xl:block xl:h-[4.5rem] xl:w-[5.5rem] 2xl:h-20 2xl:w-24"
    />
  );
}

export function ArticleCardGalleryHero() {
  const carousel = useContext(CarouselContext);
  if (!carousel) return null;

  return (
    <ArticleImageCarousel
      images={carousel.images}
      alt={carousel.alt}
      activeIndex={carousel.activeIndex}
      onActiveIndexChange={carousel.setActiveIndex}
      autoPlay={false}
      sizes="100vw"
      className="mt-3 h-32 w-full rounded-lg border sm:h-36 xl:hidden"
    />
  );
}
