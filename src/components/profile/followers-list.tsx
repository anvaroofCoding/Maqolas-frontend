"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserFollowersQuery } from "@/features/users/api/users-api";
import { getUserInitials } from "@/lib/user";

type FollowersListProps = {
  username: string;
  emptyMessage?: string;
};

function FollowersListSkeleton() {
  return (
    <ul className="space-y-1" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="py-1.5">
          <Skeleton className="h-5 w-40 rounded-md" />
        </li>
      ))}
    </ul>
  );
}

export function FollowersList({ username, emptyMessage }: FollowersListProps) {
  const { data, isLoading } = useGetUserFollowersQuery(username);

  if (isLoading) {
    return <FollowersListSkeleton />;
  }

  const followers = Array.from(
    new Map(
      (data?.followers ?? []).map((follower) => [follower.username, follower]),
    ).values(),
  );

  if (followers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {emptyMessage ?? "Obunachilar hozircha yo'q."}
      </p>
    );
  }

  return (
    <ul className="space-y-1">
      {followers.map((follower) => (
        <li key={follower.username}>
          <Link
            href={`/profil/${follower.username}`}
            className="flex items-center gap-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <Avatar size="sm" className="shrink-0">
              {follower.avatarUrl ? (
                <AvatarImage src={follower.avatarUrl} alt={follower.displayName} />
              ) : null}
              <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                {getUserInitials(follower.displayName)}
              </AvatarFallback>
            </Avatar>

            <span className="hover:underline">{follower.displayName}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
