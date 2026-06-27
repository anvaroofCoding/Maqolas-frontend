import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchArticleFeed, fetchCategories } from "@/lib/articles/server";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildTopicPageJsonLd,
} from "@/lib/seo/json-ld";

type TopicFeedJsonLdProps = {
  slug: string;
};

export async function TopicFeedJsonLd({ slug }: TopicFeedJsonLdProps) {
  const [categories, feed] = await Promise.all([
    fetchCategories(),
    fetchArticleFeed({ sort: "popular", category: slug }),
  ]);

  const topic = categories.find((category) => category.slug === slug);
  if (!topic) {
    return null;
  }

  return (
    <JsonLdScript
      data={[
        buildTopicPageJsonLd(topic.name, slug),
        buildBreadcrumbJsonLd([
          { name: "Bosh sahifa", path: "/" },
          { name: `${topic.name} maqolalari`, path: `/mavzu/${slug}` },
        ]),
        buildItemListJsonLd(
          `${topic.name} maqolalari`,
          `/mavzu/${slug}`,
          feed.articles,
        ),
      ]}
    />
  );
}
