import { ArticleFeedSkeleton } from "@/components/articles/article-feed-skeleton";
import { HomepageSeoIntroSkeleton } from "@/components/seo/homepage-seo-intro-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function MaqolalarLoading() {
  return (
    <main className={feedMainClassName}>
      <HomepageSeoIntroSkeleton label="Maqolalar yuklanmoqda" />
      <div className="mt-2">
        <ArticleFeedSkeleton count={4} title="Maqolalar yuklanmoqda" />
      </div>
    </main>
  );
}
