import Link from "next/link";
import { ArticleImageCarousel } from "@/components/articles/article-image-carousel";
import { getArticleImageUrls } from "@/lib/articles/images";
import type { ArticleSummary } from "@/features/articles/types";
import { cn } from "@/lib/utils";

type HomepageArticleMediaProps = {
  article: ArticleSummary;
  href: string;
  sizes: string;
  priority?: boolean;
  compactDots?: boolean;
  linkable?: boolean;
  className?: string;
  imageClassName?: string;
};

export function HomepageArticleMedia({
  article,
  href,
  sizes,
  priority = false,
  compactDots = false,
  linkable = true,
  className,
  imageClassName,
}: HomepageArticleMediaProps) {
  const images = getArticleImageUrls(article);
  const hasGallery = images.length > 1;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <ArticleImageCarousel
        images={images}
        alt={article.title}
        priority={priority}
        sizes={sizes}
        compactDots={compactDots}
        imageClassName={imageClassName}
      />

      {linkable && !hasGallery ? (
        <Link
          href={href}
          className="absolute inset-0 z-[1]"
          aria-label={article.title}
        />
      ) : null}
    </div>
  );
}
