"use client";

import { XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { ArticleContent } from "@/components/articles/article-content";
import { Button } from "@/components/ui/button";
import { stripArticleLeadForFocus } from "@/lib/articles/content";
import { articleSurfaceClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

type ArticleFocusReaderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  contentHtml: string;
  coverImageUrl?: string;
};

export function ArticleFocusReader({
  open,
  onOpenChange,
  title,
  contentHtml,
  coverImageUrl,
}: ArticleFocusReaderProps) {
  const focusContentHtml = useMemo(
    () => stripArticleLeadForFocus(contentHtml, coverImageUrl),
    [contentHtml, coverImageUrl],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-card">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground sm:top-6 sm:right-6"
        aria-label="Fokus rejimini yopish"
        onClick={() => onOpenChange(false)}
      >
        <XIcon className="size-5" aria-hidden />
      </Button>

      <div className="flex-1 overflow-y-auto">
        <article className={cn(articleSurfaceClassName, "py-10 sm:py-14")}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-tight">
            {title}
          </h1>

          {coverImageUrl ? (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border bg-muted sm:mt-10">
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <ArticleContent
            html={focusContentHtml}
            className={coverImageUrl ? "article-focus-content mt-8" : "article-focus-content mt-8 sm:mt-10"}
          />
        </article>
      </div>
    </div>
  );
}
