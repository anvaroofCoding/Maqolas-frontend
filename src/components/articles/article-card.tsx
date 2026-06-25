import { Eye, Heart, MessageSquare, Pin } from "lucide-react";
import Link from "next/link";
import {
  ArticleCardGalleryHero,
  ArticleCardGalleryThumbnail,
  ArticleCardImageCarousel,
} from "@/components/articles/article-card-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ArticleSummary } from "@/features/articles/types";
import { getArticleImageUrls } from "@/lib/articles/images";
import { formatArticleExcerpt, hasArticleExcerpt } from "@/lib/articles/excerpt";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { getUserInitials } from "@/lib/user";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: ArticleSummary;
};

function ArticleCardAuthor({
  article,
  authorName,
  authorProfileHref,
}: {
  article: ArticleSummary;
  authorName: string;
  authorProfileHref: string | null;
}) {
  const authorRow = (
    <>
      <Avatar size="sm" className="shrink-0">
        {article.author?.avatarUrl ? (
          <AvatarImage src={article.author.avatarUrl} alt={authorName} />
        ) : null}
        <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 text-xs leading-snug sm:text-sm">
        <span className="font-semibold text-foreground">{authorName}</span>
        {article.createdAt ? (
          <span className="text-muted-foreground">
            {" "}
            · {formatRelativeTime(article.createdAt)}
          </span>
        ) : null}
      </div>
    </>
  );

  if (authorProfileHref) {
    return (
      <Link
        href={authorProfileHref}
        className="mb-2.5 flex min-w-0 items-center gap-2 rounded-lg outline-none ring-offset-background transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 sm:mb-3"
      >
        {authorRow}
      </Link>
    );
  }

  return (
    <div className="mb-2.5 flex min-w-0 items-center gap-2 sm:mb-3">
      {authorRow}
    </div>
  );
}

export function ArticleCard({ article }: ArticleCardProps) {
  const authorName = article.author?.displayName ?? "Noma'lum muallif";
  const authorProfileHref = article.author?.username
    ? `/profil/${article.author.username}`
    : null;
  const href = `/maqola/${article.slug}`;
  const hasComments = (article.commentCount ?? 0) > 0;
  const hasLikes = (article.likeCount ?? 0) > 0;
  const imageUrls = getArticleImageUrls(article);
  const hasImages = imageUrls.length > 0;

  return (
    <Card
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-xl border shadow-sm transition-colors hover:bg-muted/20",
        article.isPinned && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      <div className="p-3 sm:p-4">
        {article.isPinned ? (
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
            <Pin className="size-3.5 fill-current" aria-hidden />
            <span>Qadalgan</span>
          </div>
        ) : null}

        {article.isNew ? (
          <div className="mb-2">
            <span className="inline-flex rounded-full bg-nav-active px-2.5 py-0.5 text-xs font-medium text-nav-active-foreground">
              Yangi
            </span>
          </div>
        ) : null}

        <ArticleCardAuthor
          article={article}
          authorName={authorName}
          authorProfileHref={authorProfileHref}
        />

        <ArticleCardImageCarousel images={imageUrls} alt={article.title}>
          <Link href={href} className="block min-w-0 max-w-full">
            <div
              className={cn(
                "min-w-0",
                hasImages &&
                  "flex flex-col gap-3 xl:flex-row xl:items-start xl:gap-4",
              )}
            >
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-3 break-words text-sm font-bold leading-snug tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-base xl:line-clamp-4">
                  {article.title}
                </h2>
                {hasArticleExcerpt(article.title, article.excerpt) ? (
                  <p className="mt-2 line-clamp-2 break-words text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:line-clamp-3 sm:text-sm sm:leading-6">
                    {formatArticleExcerpt(article.title, article.excerpt)}
                  </p>
                ) : null}
              </div>

              <ArticleCardGalleryThumbnail />
            </div>

            <ArticleCardGalleryHero />

            <Separator className="my-3 sm:my-3.5" />

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5" aria-label="Ko'rishlar">
                <Eye className="size-4 shrink-0" aria-hidden />
                <span>{formatCount(article.viewCount ?? 0)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5" aria-label="Yoqtirishlar">
                <Heart
                  className={cn(
                    "size-4 shrink-0",
                    hasLikes ? "fill-primary text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
                <span>{formatCount(article.likeCount ?? 0)}</span>
              </span>

              {hasComments ? (
                <span className="inline-flex items-center gap-1.5" aria-label="Izohlar">
                  <MessageSquare className="size-4 shrink-0" aria-hidden />
                  <span>{formatCount(article.commentCount ?? 0)}</span>
                </span>
              ) : null}
            </div>
          </Link>
        </ArticleCardImageCarousel>
      </div>
    </Card>
  );
}
