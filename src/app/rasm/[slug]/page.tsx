import { PinDetailView } from "@/components/pins/pin-detail-view";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { fetchPinBySlug, fetchPinFeed } from "@/lib/pins/server";
import { normalizeArticleImageSrc } from "@/lib/images/next-image";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PinPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PinPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchPinBySlug(slug);

  if (!data?.pin) {
    return buildPageMetadata({
      title: "Rasm topilmadi",
      path: `/rasm/${slug}`,
      noIndex: true,
    });
  }

  const { pin } = data;
  const description =
    pin.description?.trim() ||
    `${pin.title} — Maqolas vizual galereyasidagi rasm.`;

  return buildPageMetadata({
    title: pin.title,
    titleFormat: "article",
    description,
    path: `/rasm/${pin.slug}`,
    image: pin.imageUrl,
    type: "article",
    publishedTime: pin.publishedAt ?? pin.createdAt,
    modifiedTime: pin.updatedAt ?? pin.publishedAt ?? pin.createdAt,
    authors: [pin.author?.displayName ?? siteConfig.name],
  });
}

export default async function PinDetailPage({ params }: PinPageProps) {
  const { slug } = await params;
  const [data, feed] = await Promise.all([
    fetchPinBySlug(slug),
    fetchPinFeed(1, 16),
  ]);

  if (!data?.pin) {
    notFound();
  }

  const { pin } = data;
  const imageSrc = normalizeArticleImageSrc(pin.imageUrl);
  const relatedPins =
    feed?.pins.filter((item) => item.slug !== pin.slug).slice(0, 12) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: pin.title,
    description: pin.description ?? pin.title,
    contentUrl: imageSrc,
    thumbnailUrl: imageSrc,
    uploadDate: pin.publishedAt ?? pin.createdAt,
    author: pin.author
      ? {
          "@type": "Person",
          name: pin.author.displayName,
        }
      : undefined,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: pin.likeCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: pin.commentCount,
      },
    ],
  };

  return (
    <>
      <JsonLdScript
        data={[
          jsonLd,
          buildBreadcrumbJsonLd([
            { name: "Rasmlar", path: "/rasmlar" },
            { name: pin.title, path: `/rasm/${pin.slug}` },
          ]),
        ]}
      />

      <PinDetailView pin={pin} relatedPins={relatedPins} />
    </>
  );
}
