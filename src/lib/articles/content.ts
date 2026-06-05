function stripLeadImage(html: string) {
  let result = html;

  result = result.replace(/<figure[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/figure>/i, "");
  result = result.replace(/<p[^>]*>\s*<img[^>]*>\s*<\/p>/i, "");
  result = result.replace(/<img[^>]*>/i, "");

  return result.trim();
}

function stripSharedArticleLead(html: string) {
  let result = html.trim();

  result = result.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");
  result = result.replace(/<p[^>]*>\s*<img[^>]*>\s*<\/p>/i, "");
  result = result.replace(/<hr[^>]*>/i, "");
  result = result.replace(/^(?:\s|<p[^>]*>\s*<\/p>|<hr[^>]*>)+/i, "");

  return result.trim();
}

/** Detail sahifada alohida ko'rsatiladigan sarlavha va muqovani HTML dan olib tashlash */
export function stripArticleLeadFromHtml(html: string): string {
  return stripSharedArticleLead(html).replace(/<img[^>]*>/gi, "");
}

/** Fokus rejimida matn ichidagi rasmlarni saqlab qolish */
export function stripArticleLeadForFocus(
  html: string,
  coverImageUrl?: string,
): string {
  const result = stripSharedArticleLead(html);

  if (!coverImageUrl) return result;

  // Muqova alohida ko'rsatilganda, kontentdagi takrorlangan birinchi rasmni olib tashlash
  return stripLeadImage(result);
}
