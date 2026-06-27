import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchArticleFeed } from "@/lib/articles/server";
import { buildItemListJsonLd, buildYangiPageJsonLd } from "@/lib/seo/json-ld";

export async function YangiFeedJsonLd() {
  const feed = await fetchArticleFeed({ sort: "newest" });

  return (
    <JsonLdScript
      data={[
        buildYangiPageJsonLd(),
        buildItemListJsonLd("Yangi maqolalar", "/yangi", feed.articles),
      ]}
    />
  );
}
