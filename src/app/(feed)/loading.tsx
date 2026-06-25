import { HomepageFeedSkeleton } from "@/components/articles/homepage-feed-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function HomeLoading() {
  return (
    <main className={feedMainClassName}>
      <HomepageFeedSkeleton title="Ommabop maqolalar yuklanmoqda" />
    </main>
  );
}
