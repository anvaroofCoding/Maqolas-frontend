"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import type { ArticleFeedResponse, ArticleSummary } from "@/features/articles/types";
import { useAppSelector } from "@/lib/store/hooks";

type PublicProfilePageClientProps = {
  username: string;
  displayName: string;
  initialArticles?: ArticleSummary[];
  initialPagination?: ArticleFeedResponse["pagination"];
};

export function PublicProfilePageClient({
  username,
  displayName,
  initialArticles,
  initialPagination,
}: PublicProfilePageClientProps) {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const cachedUser = useAppSelector((state) => state.auth.user);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  const currentUser = meData?.user ?? cachedUser;

  useEffect(() => {
    if (!username || !currentUser?.username) return;
    if (currentUser.username.toLowerCase() === username.toLowerCase()) {
      router.replace("/profil");
    }
  }, [username, currentUser?.username, router]);

  return (
    <div className="pt-4">
      <ProfileTabs
        username={username}
        displayName={displayName}
        isOwnProfile={false}
        initialArticles={initialArticles}
        initialPagination={initialPagination}
      />
    </div>
  );
}
