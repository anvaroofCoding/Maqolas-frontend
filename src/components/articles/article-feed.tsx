import { Newspaper } from "lucide-react";
import { ArticleCard } from "@/components/articles/article-card";
import type { ArticleSummary } from "@/features/articles/types";
import { cn } from "@/lib/utils";

type ArticleFeedProps = {
  articles: ArticleSummary[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
};

export function ArticleFeed({
  articles,
  title,
  emptyMessage = "Hozircha nashr etilgan maqolalar yo'q.",
  compact = false,
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
          "flex flex-col gap-4",
          compact ? "pt-0 pb-2" : "pb-4 pt-2 md:gap-5 md:pb-6 md:pt-0",
        )}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
