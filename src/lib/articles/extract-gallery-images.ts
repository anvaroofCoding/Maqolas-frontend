export type GalleryImage = {
  src: string;
  alt: string;
};

export function extractGalleryImages(
  imageUrls: string[] | undefined,
  coverImageUrl: string | undefined,
  title: string,
  contentHtml?: string,
): GalleryImage[] {
  if (imageUrls?.length) {
    return imageUrls.map((src) => ({ src, alt: title }));
  }

  const matches = contentHtml
    ? Array.from(
        contentHtml.matchAll(
          /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']|<img[^>]+alt=["']([^"']*)["'][^>]*src=["']([^"']+)["']/gi,
        ),
      )
    : [];

  const parsed = matches
    .map((match) => {
      const src = match[1] || match[4];
      const alt = match[2] || match[3] || title;
      if (!src) return null;
      return { src, alt };
    })
    .filter((image): image is GalleryImage => Boolean(image));

  const seen = new Set<string>();
  const unique = parsed.filter((image) => {
    if (seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });

  if (coverImageUrl && !unique.some((image) => image.src === coverImageUrl)) {
    return [{ src: coverImageUrl, alt: title }, ...unique];
  }

  if (unique.length > 0) {
    return unique;
  }

  return coverImageUrl ? [{ src: coverImageUrl, alt: title }] : [];
}
