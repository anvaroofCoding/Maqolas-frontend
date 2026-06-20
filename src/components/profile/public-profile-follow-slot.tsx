"use client";

import { FollowButton } from "@/components/profile/follow-button";
import { useGetPublicProfileQuery } from "@/features/users/api/users-api";

type PublicProfileFollowSlotProps = {
  username: string;
};

export function PublicProfileFollowSlot({ username }: PublicProfileFollowSlotProps) {
  const { data } = useGetPublicProfileQuery(username, { skip: !username });

  if (!data) {
    return <div className="h-9 w-24 shrink-0 rounded-full bg-muted/60" aria-hidden />;
  }

  return (
    <FollowButton
      username={username}
      initialFollowing={data.isFollowing}
      className="shrink-0 self-start"
    />
  );
}
