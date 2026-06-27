import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchHomepageLayout } from "@/lib/articles/server";
import { buildFaqJsonLd, buildItemListJsonLd } from "@/lib/seo/json-ld";

export async function HomepageFeedJsonLd() {
  const homepage = await fetchHomepageLayout();

  return (
    <JsonLdScript
      data={[
        buildItemListJsonLd(
          "Ommabop o'zbekcha maqolalar",
          "/",
          homepage.feed.articles,
        ),
        buildFaqJsonLd(),
      ]}
    />
  );
}
