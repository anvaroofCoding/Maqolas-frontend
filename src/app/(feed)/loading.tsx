import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function HomeLoading() {
  return (
    <main className={feedMainClassName}>
      <ArticleFeedSkeleton count={3} title="Ommabop maqolalar yuklanmoqda" />
    </main>
  );
}
