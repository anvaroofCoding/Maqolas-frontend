import { ArticleCardSkeleton } from "@/components/articles/article-card-skeleton";
import { articleFeedGridClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

type ArticleFeedSkeletonProps = {
  count?: number;
  title?: string;
  compact?: boolean;
  inline?: boolean;
};

export function ArticleFeedSkeleton({
  count = 5,
  title,
  compact = false,
  inline = false,
}: ArticleFeedSkeletonProps) {
  return (
    <section
      aria-label={title ?? "Maqolalar yuklanmoqda"}
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Maqolalar yuklanmoqda</span>
      <div
        className={cn(
          articleFeedGridClassName,
          !inline && "min-h-[40vh]",
          compact ? "pt-0 pb-2" : "pb-4 pt-2 md:pb-6 md:pt-0",
        )}
      >
        {Array.from({ length: count }, (_, index) => (
          <ArticleCardSkeleton key={index} withCover={index !== 1} />
        ))}
      </div>
    </section>
  );
}
