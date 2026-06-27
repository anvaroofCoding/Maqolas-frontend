import { Newspaper } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleCardWithHoverPreview } from "@/components/articles/article-card-with-hover-preview";
import type { ArticleSummary } from "@/features/articles/types";
import { articleFeedGridClassName } from "@/lib/layout";
import { cn } from "@/lib/utils";

type ArticleFeedProps = {
  articles: ArticleSummary[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
  hoverPreview?: boolean;
};

export function ArticleFeed({
  articles,
  title,
  emptyMessage = "Hozircha nashr etilgan maqolalar yo'q.",
  compact = false,
  hoverPreview = false,
}: ArticleFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <Newspaper className="size-10 text-muted-foreground/60" aria-hidden />
        <p className="max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section aria-label={title ?? "Maqolalar"} className="min-w-0 max-w-full">
      {title ? (
        <h1 className="sr-only">{title}</h1>
      ) : null}
      <div
        className={cn(
          articleFeedGridClassName,
          compact ? "pt-0 pb-2" : "pb-4 pt-0",
        )}
      >
        {articles.map((article) =>
          hoverPreview ? (
            <ArticleCardWithHoverPreview key={article.id} article={article} />
          ) : (
            <ArticleCard key={article.id} article={article} />
          ),
        )}
      </div>
    </section>
  );
}
