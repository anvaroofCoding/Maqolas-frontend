import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function SavedFeedLoading() {
  return (
    <main className={feedMainClassName}>
      <ArticleFeedSkeleton title="Mening maqolam yuklanmoqda" />
    </main>
  );
}
