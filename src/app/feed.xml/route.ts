import { fetchArticleFeed } from "@/lib/articles/server";
import { buildRssFeed } from "@/lib/seo/rss";

export const revalidate = 300;

export async function GET() {
  const feed = await fetchArticleFeed({ sort: "newest", limit: 50 });
  const xml = buildRssFeed(feed.articles);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
