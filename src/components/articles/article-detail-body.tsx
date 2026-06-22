"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArticleContent } from "@/components/articles/article-content";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/components/articles/image-lightbox";

type ArticleDetailBodyProps = {
  slug: string;
  coverImageUrl?: string;
  title: string;
  excerpt?: string;
  authorName: string;
  authorAvatarUrl?: string;
  categoryName?: string;
  contentHtml: string;
  contentJson?: Record<string, unknown> | null;
  contentClassName?: string;
  itemProp?: string;
};

export function ArticleDetailBody({
  title,
  contentHtml,
  contentJson,
  contentClassName,
  itemProp,
}: ArticleDetailBodyProps) {
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
      <div ref={contentRef}>
        <ArticleContent
          className={contentClassName}
          itemProp={itemProp}
          html={contentHtml}
          contentJson={contentJson}
        />
      </div>

      <ImageLightbox
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}
