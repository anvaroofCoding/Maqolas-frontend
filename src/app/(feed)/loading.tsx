import { HomepageFeedSkeleton } from "@/components/articles/homepage-feed-skeleton";
import { HomepageSeoIntroSkeleton } from "@/components/seo/homepage-seo-intro-skeleton";
import { feedMainClassName } from "@/lib/layout";

export default function HomeLoading() {
  return (
    <main className={feedMainClassName}>
      <HomepageSeoIntroSkeleton label="Ommabop maqolalar yuklanmoqda" />
      <HomepageFeedSkeleton
        title="Ommabop maqolalar yuklanmoqda"
        showIntro={false}
      />
    </main>
  );
}
