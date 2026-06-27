import { Suspense } from "react";
import { TopicFeedPageClient } from "@/components/articles/article-feed-page-client";
import { TopicFeedJsonLd } from "@/components/seo/topic-feed-json-ld";
import { buildTopicDescription } from "@/lib/seo/description";
import { buildTopicKeywords } from "@/lib/seo/keywords";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fetchCategories } from "@/lib/articles/server";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

async function findTopicBySlug(slug: string) {
  const categories = await fetchCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = await findTopicBySlug(slug);

  if (!topic) {
    return buildPageMetadata({
      title: "Mavzu topilmadi",
      path: `/mavzu/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${topic.name} maqolalari — o'zbekcha maqolalar`,
    description: buildTopicDescription(topic.name),
    path: `/mavzu/${slug}`,
    keywords: buildTopicKeywords(topic.name, slug),
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;

  return (
    <>
      <Suspense fallback={null}>
        <TopicFeedJsonLd slug={slug} />
      </Suspense>
      <TopicFeedPageClient slug={slug} />
    </>
  );
}
