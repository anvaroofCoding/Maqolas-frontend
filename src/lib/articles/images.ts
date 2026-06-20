import { extractGalleryImages } from "@/lib/articles/extract-gallery-images";

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
  ).map((image) => image.src);
}
