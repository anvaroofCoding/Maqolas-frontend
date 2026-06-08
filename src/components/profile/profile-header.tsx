"use client";

import {
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  PencilIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { ProfileAvatarUpload } from "@/components/profile/profile-avatar-upload";
import { Button } from "@/components/ui/button";
import type { AuthUser, UserStats } from "@/features/auth/types";
import { formatSocialHref } from "@/lib/user";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  user: AuthUser;
  stats: UserStats;
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);

  const social = {
    website: formatSocialHref("website", user.social?.website),
    linkedin: formatSocialHref("linkedin", user.social?.linkedin),
    telegram: formatSocialHref("telegram", user.social?.telegram),
    instagram: formatSocialHref("instagram", user.social?.instagram),
  };

  return (
    <>
      <header className="flex items-start gap-4 border-b border-border pb-5 sm:gap-6 sm:pb-6">
        <ProfileAvatarUpload user={user} />

        <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
              {user.displayName}
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 text-muted-foreground sm:size-8"
              aria-label="Profilni tahrirlash"
              onClick={() => setEditOpen(true)}
            >
              <PencilIcon className="size-4" />
            </Button>
          </div>

          <p className="truncate text-sm text-muted-foreground">{user.email}</p>

          {user.bio ? (
            <p className="text-sm break-words text-foreground/80">{user.bio}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <SocialLink href={social.website} label="Veb-sayt">
              <GlobeIcon className="size-4" />
            </SocialLink>
            <SocialLink href={social.linkedin} label="LinkedIn">
              <LinkedinIcon className="size-4" />
            </SocialLink>
            <SocialLink href={social.telegram} label="Telegram">
              <SendIcon className="size-4" />
            </SocialLink>
            <SocialLink href={social.instagram} label="Instagram">
              <InstagramIcon className="size-4" />
            </SocialLink>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {stats.articlesCount}
            </span>{" "}
            ta maqola ·{" "}
            <span className="font-medium text-foreground">
              {stats.followersCount}
            </span>{" "}
            ta obunachi
          </p>
        </div>
      </header>

      <EditProfileDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
