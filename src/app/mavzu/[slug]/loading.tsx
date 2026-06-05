import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function TopicLoading() {
  return (
    <main className={feedMainClassName}>
      <ArticleFeedSkeleton count={3} title="Mavzu maqolalari yuklanmoqda" />
    </main>
  );
}
