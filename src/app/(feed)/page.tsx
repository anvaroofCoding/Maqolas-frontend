import { Suspense } from "react";
import { HomepageFeedPageClient } from "@/components/articles/homepage-feed-page-client";
import { HomepageFeedJsonLd } from "@/components/seo/homepage-feed-json-ld";
import { buildHomepageDescription } from "@/lib/seo/description";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { coreMaqolaKeywords } from "@/lib/seo/core-keywords";

export const metadata = buildPageMetadata({
  titleFormat: "site",
  description: buildHomepageDescription(),
  path: "/",
  keywords: [...coreMaqolaKeywords],
});

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <HomepageFeedJsonLd />
      </Suspense>
      <HomepageFeedPageClient />
    </>
  );
}
