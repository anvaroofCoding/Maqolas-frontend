import type { PublicProfileSummary } from "@/lib/articles/server";
import { getUserInitials, resolveAvatarUrl } from "@/lib/user";
import { PublicProfileFollowSlot } from "./public-profile-follow-slot";

type PublicProfileSeoHeaderProps = {
  profile: PublicProfileSummary;
};

export function PublicProfileSeoHeader({ profile }: PublicProfileSeoHeaderProps) {
  const avatarUrl = resolveAvatarUrl(profile.avatarUrl);

  return (
    <header className="flex items-start gap-4 border-b border-border pb-5 sm:gap-6 sm:pb-6">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted sm:size-24">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={profile.displayName}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-base font-medium text-muted-foreground sm:text-lg">
            {getUserInitials(profile.displayName)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <h1 className="min-w-0 break-words text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
            {profile.displayName}
          </h1>
          <PublicProfileFollowSlot username={profile.username} />
        </div>

        <p className="text-sm text-muted-foreground">@{profile.username}</p>

        {profile.bio ? (
          <p className="text-sm break-words text-foreground/80">{profile.bio}</p>
        ) : null}

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{profile.articlesCount}</span>{" "}
          ta maqola ·{" "}
          <span className="font-medium text-foreground">{profile.followersCount}</span>{" "}
          ta obunachi
        </p>
      </div>
    </header>
  );
}
