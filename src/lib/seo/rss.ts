import { siteConfig } from "@/config/site";
import type { ArticleSummary } from "@/features/articles/types";
import { articleUrl } from "@/lib/seo/urls";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssFeed(articles: ArticleSummary[]): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const items = articles
    .map((article) => {
      const link = articleUrl(article.slug);
      const pubDate = new Date(
        article.publishedAt ?? article.createdAt ?? Date.now(),
      ).toUTCString();
      const description = escapeXml(article.excerpt ?? article.title);
      const author = article.author?.displayName
        ? `<author>${escapeXml(article.author.displayName)}</author>`
        : "";

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      ${author}
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${base}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>uz</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
