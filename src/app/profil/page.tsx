"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ProfileLentaRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "lenta" || tab === "saved") {
      router.replace("/lenta");
    }
  }, [searchParams, router]);

  return null;
}
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfilePageSkeleton, ProfileTabsSkeleton } from "@/components/profile/profile-page-skeleton";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { useAppSelector } from "@/lib/store/hooks";

function ProfilePageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      {children}
    </main>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const cachedUser = useAppSelector((state) => state.auth.user);

  const { data, isLoading, isFetching, isError } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });

  const user = data?.user ?? cachedUser;
  const stats = data?.stats ?? { articlesCount: 0, followersCount: 0 };
  const showSkeleton =
    !mounted || !accessToken || ((isLoading || isFetching) && !user);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && !accessToken) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, accessToken, router]);

  if (showSkeleton) {
    return (
      <ProfilePageShell>
        <ProfilePageSkeleton />
      </ProfilePageShell>
    );
  }

  if (isError || !user) {
    return (
      <ProfilePageShell>
        <p className="text-sm text-muted-foreground">
          Profil yuklanmadi. Qayta kiring.
        </p>
      </ProfilePageShell>
    );
  }

  return (
    <ProfilePageShell>
      <Suspense fallback={null}>
        <ProfileLentaRedirect />
      </Suspense>
      <ProfileHeader user={user} stats={stats} />
      <div className="pt-4">
        <Suspense fallback={<ProfileTabsSkeleton variant="own" />}>
          <ProfileTabs
            username={user.username}
            displayName={user.displayName}
            isOwnProfile
          />
        </Suspense>
      </div>
    </ProfilePageShell>
  );
}
