import { cache } from "react";
import { env } from "@/config/env";
import type { PinDetailResponse, PinFeedResponse } from "@/features/pins/types";
import { PINS_FEED_PAGE_SIZE } from "@/features/pins/api/pins-api";

async function fetchJson<T>(url: string, revalidate = 60): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export const fetchPinFeed = cache(
  async (page = 1, limit = PINS_FEED_PAGE_SIZE): Promise<PinFeedResponse | null> => {
    return fetchJson<PinFeedResponse>(
      `${env.NEXT_PUBLIC_API_URL}/pins/feed?page=${page}&limit=${limit}`,
      30,
    );
  },
);

export const fetchPinBySlug = cache(async (slug: string) => {
  return fetchJson<PinDetailResponse>(
    `${env.NEXT_PUBLIC_API_URL}/pins/slug/${encodeURIComponent(slug)}`,
    30,
  );
});

export type PinSitemapEntry = {
  slug: string;
  updatedAt: string;
};

export async function fetchPinSitemapEntries(): Promise<PinSitemapEntry[]> {
  const data = await fetchJson<{ entries: PinSitemapEntry[] }>(
    `${env.NEXT_PUBLIC_API_URL}/pins/sitemap`,
    3600,
  );

  return data?.entries ?? [];
}
