function decodeHtmlEntities(text: string): string {
  if (typeof document === "undefined") {
    return text
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'");
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export function htmlToPlainText(html: string): string {
  if (typeof document === "undefined") {
    return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "));
  }

  const container = document.createElement("div");
  container.innerHTML = html;
  return (container.textContent ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractWordsFromText(text: string): string[] {
  return text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

export function extractWordsFromArticle(title: string, contentHtml: string): string[] {
  const plainText = [title, htmlToPlainText(contentHtml)].filter(Boolean).join(" ");
  return extractWordsFromText(plainText);
}

export function getOptimalRecognitionIndex(word: string): number {
  const length = [...word].length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}
