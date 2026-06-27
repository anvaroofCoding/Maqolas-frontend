import { Suspense } from "react";
import { ArticleFeedPageClient } from "@/components/articles/article-feed-page-client";
import { MaqolalarFeedJsonLd } from "@/components/seo/maqolalar-feed-json-ld";
import { buildMaqolalarHubDescription } from "@/lib/seo/description";
import { buildMaqolalarHubKeywords } from "@/lib/seo/keywords";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Maqolalar — barcha o'zbekcha maqolalar",
  description: buildMaqolalarHubDescription(),
  path: "/maqolalar",
  keywords: buildMaqolalarHubKeywords(),
});

export default function MaqolalarHubPage() {
  return (
    <>
      <Suspense fallback={null}>
        <MaqolalarFeedJsonLd />
      </Suspense>
      <ArticleFeedPageClient
        sort="popular"
        title="Ommabop maqolalar"
        emptyMessage="Hozircha maqolalar yo'q. Tez orada yangi kontent paydo bo'ladi."
        showTopicLinks
      />
    </>
  );
}
