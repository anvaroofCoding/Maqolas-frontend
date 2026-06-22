import { extractGalleryImages } from "@/lib/articles/extract-gallery-images";
import { resolveUploadUrl } from "@/lib/articles/resolve-media-url";

export function getArticleImageUrls(article: {
  imageUrls?: string[];
  coverImageUrl?: string;
  title?: string;
  contentHtml?: string;
}): string[] {
  return extractGalleryImages(
    article.imageUrls,
    article.coverImageUrl,
    article.title ?? "Maqola",
    article.contentHtml,
  )
    .map((image) => resolveUploadUrl(image.src) ?? image.src)
    .filter(Boolean);
}

export function getPrimaryArticleImageUrl(
  article: Parameters<typeof getArticleImageUrls>[0],
): string | undefined {
  return getArticleImageUrls(article)[0];
}
