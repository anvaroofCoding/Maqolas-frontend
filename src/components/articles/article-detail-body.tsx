"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ZoomInIcon } from "lucide-react";
import { ArticleContent } from "@/components/articles/article-content";
import { ArticleShareStory } from "@/components/articles/article-share-story";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/components/articles/image-lightbox";
import { cn } from "@/lib/utils";

type ArticleDetailBodyProps = {
  slug: string;
  coverImageUrl?: string;
  title: string;
  excerpt?: string;
  authorName: string;
  authorAvatarUrl?: string;
  categoryName?: string;
  contentHtml: string;
  contentClassName?: string;
  itemProp?: string;
};

export function ArticleDetailBody({
  slug,
  coverImageUrl,
  title,
  excerpt,
  authorName,
  authorAvatarUrl,
  categoryName,
  contentHtml,
  contentClassName,
  itemProp,
}: ArticleDetailBodyProps) {
  const storyData = {
    slug,
    title,
    excerpt,
    coverImageUrl,
    authorName,
    authorAvatarUrl,
    categoryName,
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxImage({ src, alt });
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll("img"));

    const handleClick = (event: Event) => {
      const target = event.currentTarget as HTMLImageElement;
      const src = target.currentSrc || target.src;
      if (!src) return;
      openLightbox(src, target.alt || title);
    };

    for (const image of images) {
      image.classList.add("cursor-zoom-in", "transition-opacity", "hover:opacity-90");
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.addEventListener("click", handleClick);
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick(event);
        }
      });
    }

    return () => {
      for (const image of images) {
        image.removeEventListener("click", handleClick);
      }
    };
  }, [contentHtml, openLightbox, title]);

  return (
    <>
      {coverImageUrl ? (
        <div className="mt-5">
          <div
            className={cn(
              "group relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-muted",
              "transition-transform duration-200 hover:shadow-md",
            )}
          >
            <button
              type="button"
              className="absolute inset-0 z-0 block w-full cursor-zoom-in"
              aria-label="Rasmni kattalashtirish"
              onClick={() => openLightbox(coverImageUrl, title)}
            >
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                itemProp="image"
                unoptimized
              />
              <span className="pointer-events-none absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                <ZoomInIcon className="size-4" aria-hidden />
              </span>
            </button>
            <div className="absolute left-3 top-3 z-10">
              <ArticleShareStory storyData={storyData} variant="overlay" />
            </div>
          </div>
        </div>
      ) : null}

      <div ref={contentRef}>
        <ArticleContent
          className={contentClassName}
          itemProp={itemProp}
          html={contentHtml}
        />
      </div>

      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}
