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

export function ArticleCard({ article }: ArticleCardProps) {
  const authorName = article.author?.displayName ?? "Noma'lum muallif";
  const authorProfileHref = article.author?.username
    ? `/profil/${article.author.username}`
    : null;
  const href = `/maqola/${article.slug}`;
  const hasComments = (article.commentCount ?? 0) > 0;
  const hasLikes = (article.likeCount ?? 0) > 0;
  const imageUrls = getArticleImageUrls(article);

  return (
    <Card
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-xl border shadow-sm transition-colors hover:bg-muted/20",
        article.isPinned && "border-primary/40 ring-1 ring-primary/20",
      )}
    >
      <div className="px-4 py-4 sm:p-5">
        {article.isPinned ? (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-primary">
            <Pin className="size-3.5 fill-current" aria-hidden />
            <span>Qadalgan</span>
          </div>
        ) : null}

        {article.isNew ? (
          <div className="mb-3">
            <span className="inline-flex rounded-full bg-nav-active px-2.5 py-0.5 text-xs font-medium text-nav-active-foreground">
              Yangi
            </span>
          </div>
        ) : null}

        {authorProfileHref ? (
          <Link
            href={authorProfileHref}
            className="mb-4 flex items-center gap-2.5 rounded-lg outline-none ring-offset-background transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Avatar size="sm">
              {article.author?.avatarUrl ? (
                <AvatarImage src={article.author.avatarUrl} alt={authorName} />
              ) : null}
              <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-sm">
              <span className="font-semibold text-foreground">{authorName}</span>
              {article.createdAt ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {formatRelativeTime(article.createdAt)}
                </span>
              ) : null}
            </div>
          </Link>
        ) : (
          <div className="mb-4 flex items-center gap-2.5">
            <Avatar size="sm">
              {article.author?.avatarUrl ? (
                <AvatarImage src={article.author.avatarUrl} alt={authorName} />
              ) : null}
              <AvatarFallback>{getUserInitials(authorName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-sm">
              <span className="font-semibold text-foreground">{authorName}</span>
              {article.createdAt ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {formatRelativeTime(article.createdAt)}
                </span>
              ) : null}
            </div>
          </div>
        )}

        <ArticleCardImageCarousel images={imageUrls} alt={article.title}>
          <Link href={href} className="block min-w-0 max-w-full">
            <div className="flex min-w-0 gap-4 sm:gap-5">
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 className="break-words text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
                  {article.title}
                </h2>
                {hasArticleExcerpt(article.title, article.excerpt) ? (
                  <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere] sm:text-[15px]">
                    {formatArticleExcerpt(article.title, article.excerpt)}
                  </p>
                ) : null}
              </div>

              <ArticleCardGalleryThumbnail />
            </div>

            <ArticleCardGalleryHero />

            <Separator className="my-4" />

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
