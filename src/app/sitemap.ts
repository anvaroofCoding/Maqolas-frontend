import type { MetadataRoute } from "next";
import { topicNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { fetchSitemapEntries } from "@/lib/articles/server";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "hourly", priority: 1 },
  { path: "/yangi", changeFrequency: "hourly", priority: 0.9 },
  { path: "/mavzular", changeFrequency: "weekly", priority: 0.7 },
  { path: "/dastur-haqida", changeFrequency: "monthly", priority: 0.5 },
  { path: "/foydalanish-shartlari", changeFrequency: "yearly", priority: 0.3 },
  { path: "/maxfiylik-siyosati", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const articleEntries = await fetchSitemapEntries();

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const topicPages: MetadataRoute.Sitemap = topicNavItems.map((topic) => ({
    url: `${base}${topic.href}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articleEntries.map((entry) => ({
    url: `${base}/maqola/${entry.slug}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticPages, ...topicPages, ...articlePages];
}
