"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PublicProfileHeader } from "@/components/profile/public-profile-header";
import { ProfilePageSkeleton, ProfileTabsSkeleton } from "@/components/profile/profile-page-skeleton";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { useGetPublicProfileQuery } from "@/features/users/api/users-api";
import { useAppSelector } from "@/lib/store/hooks";

function ProfilePageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      {children}
    </main>
  );
}

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params.username?.toLowerCase();
  const [mounted, setMounted] = useState(false);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const cachedUser = useAppSelector((state) => state.auth.user);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useGetPublicProfileQuery(username, {
    skip: !username,
  });

  useEffect(() => {
    if (mounted && accessToken) {
      void refetch();
    }
  }, [mounted, accessToken, refetch]);

  const currentUser = meData?.user ?? cachedUser;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !username || !currentUser?.username) return;
    if (currentUser.username.toLowerCase() === username) {
      router.replace("/profil");
    }
  }, [mounted, username, currentUser?.username, router]);

  if (!username) {
    return (
      <ProfilePageShell>
        <p className="text-sm text-muted-foreground">Profil topilmadi.</p>
      </ProfilePageShell>
    );
  }

  if (isLoading) {
    return (
      <ProfilePageShell>
        <ProfilePageSkeleton variant="public" />
      </ProfilePageShell>
    );
  }

  if (isError || !profileData?.user) {
    return (
      <ProfilePageShell>
        <p className="text-sm text-muted-foreground">Foydalanuvchi topilmadi.</p>
      </ProfilePageShell>
    );
  }

  const { user, stats, isFollowing } = profileData;

  return (
    <ProfilePageShell>
      <PublicProfileHeader user={user} stats={stats} isFollowing={isFollowing} />
      <div className="pt-4">
        <Suspense fallback={<ProfileTabsSkeleton variant="public" />}>
          <ProfileTabs
            username={user.username}
            displayName={user.displayName}
            isOwnProfile={false}
          />
        </Suspense>
      </div>
    </ProfilePageShell>
  );
}
