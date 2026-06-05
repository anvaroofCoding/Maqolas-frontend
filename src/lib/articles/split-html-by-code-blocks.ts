const PRE_BLOCK_REGEX = /<pre[\s\S]*?<\/pre>/gi;

export type HtmlContentPart =
  | { type: "html"; content: string }
  | { type: "pre"; content: string };

export function splitHtmlByCodeBlocks(html: string): HtmlContentPart[] {
  const parts: HtmlContentPart[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(PRE_BLOCK_REGEX)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({
        type: "html",
        content: html.slice(lastIndex, index),
      });
    }

    parts.push({
      type: "pre",
      content: match[0],
    });

    lastIndex = index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({
      type: "html",
      content: html.slice(lastIndex),
    });
  }

  if (parts.length === 0) {
    parts.push({ type: "html", content: html });
  }

  return parts;
}
