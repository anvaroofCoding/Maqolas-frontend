import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function MaqolalarLoading() {
  return (
    <main className={feedMainClassName}>
      <ArticleFeedSkeleton count={4} title="Maqolalar yuklanmoqda" />
    </main>
  );
}
