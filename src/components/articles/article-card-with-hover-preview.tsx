import { ArticleCard } from "@/components/articles/article-card";
import { ArticleCardHoverLift } from "@/components/articles/article-card-hover-lift";
import type { ArticleSummary } from "@/features/articles/types";

type ArticleCardWithHoverPreviewProps = {
  article: ArticleSummary;
};

export function ArticleCardWithHoverPreview({
  article,
}: ArticleCardWithHoverPreviewProps) {
  return (
    <ArticleCardHoverLift article={article}>
      <ArticleCard article={article} />
    </ArticleCardHoverLift>
  );
}
