import { Suspense } from "react";
import { PublicProfilePageClient } from "@/components/profile/public-profile-page-client";
import { PublicProfileSeoHeader } from "@/components/profile/public-profile-seo-header";
import { ProfileTabsSkeleton } from "@/components/profile/profile-page-skeleton";
import {
  fetchPublicProfile,
  fetchPublicProfileArticles,
} from "@/lib/articles/server";
import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";

type PublicProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const normalized = username.toLowerCase();
  const profile = await fetchPublicProfile(normalized);

  if (!profile) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
        <p className="text-sm text-muted-foreground">Foydalanuvchi topilmadi.</p>
      </main>
    );
  }

  const initialArticles = await fetchPublicProfileArticles(profile.username, 10);
  const initialPagination = {
    page: 1,
    limit: ARTICLE_FEED_PAGE_SIZE,
    total: profile.articlesCount,
    totalPages: Math.max(
      1,
      Math.ceil(profile.articlesCount / ARTICLE_FEED_PAGE_SIZE),
    ),
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <PublicProfileSeoHeader profile={profile} />
      <Suspense fallback={<ProfileTabsSkeleton variant="public" />}>
        <PublicProfilePageClient
          username={profile.username}
          displayName={profile.displayName}
          initialArticles={initialArticles}
          initialPagination={initialPagination}
        />
      </Suspense>
    </main>
  );
}
