"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileTabsSkeleton } from "@/components/profile/profile-page-skeleton";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { useAppSelector } from "@/lib/store/hooks";

type PublicProfilePageClientProps = {
  username: string;
  displayName: string;
};

export function PublicProfilePageClient({
  username,
  displayName,
}: PublicProfilePageClientProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const cachedUser = useAppSelector((state) => state.auth.user);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });

  const currentUser = meData?.user ?? cachedUser;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !username || !currentUser?.username) return;
    if (currentUser.username.toLowerCase() === username) {
      router.replace("/profil");
    }
  }, [mounted, username, currentUser?.username, router]);

  return (
    <div className="pt-4">
      {mounted ? (
        <ProfileTabs
          username={username}
          displayName={displayName}
          isOwnProfile={false}
        />
      ) : (
        <ProfileTabsSkeleton variant="public" />
      )}
    </div>
  );
}
