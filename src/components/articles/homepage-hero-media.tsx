import Link from "next/link";
import Image from "next/image";
import { ArticleImageCarousel } from "@/components/articles/article-image-carousel";
import { getArticleImageUrls } from "@/lib/articles/images";
import { articleImageProps } from "@/lib/images/next-image";
import type { ArticleSummary } from "@/features/articles/types";
import { cn } from "@/lib/utils";

type HomepageHeroMediaProps = {
  article: ArticleSummary;
  href: string;
  className?: string;
  imageClassName?: string;
};

const HERO_SIZES =
  "(min-width: 1280px) 620px, (min-width: 768px) 60vw, 100vw";

export function HomepageHeroMedia({
  article,
  href,
  className,
  imageClassName,
}: HomepageHeroMediaProps) {
  const images = getArticleImageUrls(article);
  const primaryImage = images[0];

  return (
    <Link
      href={href}
      className="group block shrink-0 overflow-hidden rounded-card-xl border bg-card shadow-sm"
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          className,
        )}
      >
        {images.length <= 1 ? (
          primaryImage ? (
            <Image
              src={primaryImage}
              alt={article.title}
              fill
              sizes={HERO_SIZES}
              className={cn("object-cover", imageClassName)}
              {...articleImageProps(primaryImage, { priority: true })}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/25 via-primary/10 to-muted" />
          )
        ) : (
          <ArticleImageCarousel
            images={images}
            alt={article.title}
            priority
            sizes={HERO_SIZES}
            imageClassName={imageClassName}
          />
        )}
      </div>
    </Link>
  );
}
