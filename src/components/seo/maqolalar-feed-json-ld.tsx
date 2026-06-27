import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchArticleFeed } from "@/lib/articles/server";
import {
  buildFaqJsonLd,
  buildItemListJsonLd,
  buildMaqolalarHubJsonLd,
} from "@/lib/seo/json-ld";

export async function MaqolalarFeedJsonLd() {
  const feed = await fetchArticleFeed({ sort: "popular" });

  return (
    <JsonLdScript
      data={[
        buildMaqolalarHubJsonLd(),
        buildFaqJsonLd(),
        buildItemListJsonLd("Maqolalar", "/maqolalar", feed.articles),
      ]}
    />
  );
}
