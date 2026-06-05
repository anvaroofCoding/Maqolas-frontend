"use client";

import { Loader2Icon, UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { Button } from "@/components/ui/button";
import {
  useGetPublicProfileQuery,
  useToggleFollowMutation,
} from "@/features/users/api/users-api";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
  username: string;
  initialFollowing?: boolean;
  className?: string;
  compact?: boolean;
};

export function FollowButton({
  username,
  initialFollowing = false,
  className,
  compact = false,
}: FollowButtonProps) {
  const normalizedUsername = username.trim().toLowerCase();
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoggedIn = mounted && (isAuthenticated || Boolean(accessToken));

  const { data: profileData, refetch } = useGetPublicProfileQuery(
    normalizedUsername,
    { skip: !mounted },
  );
  const following = profileData?.isFollowing ?? initialFollowing;
  const displayName = profileData?.user.displayName ?? username;

  const [toggleFollow, { isLoading }] = useToggleFollowMutation();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !accessToken) return;
    void refetch();
  }, [mounted, accessToken, refetch]);

  const handleClick = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    void (async () => {
      try {
        const result = await toggleFollow(normalizedUsername).unwrap();

        if (result.following) {
          toast.success(`${displayName}ga muvaffaqiyatli obuna bo'ldingiz`);
        } else {
          toast.info("Obuna bekor qilindi");
        }
      } catch {
        toast.error("Obuna amali bajarilmadi. Qayta urinib ko'ring.");
      }
    })();
  };

  const icon = isLoading ? (
    <Loader2Icon className="size-4 animate-spin" aria-hidden />
  ) : following ? (
    <UserMinusIcon className="size-4" aria-hidden />
  ) : (
    <UserPlusIcon className="size-4" aria-hidden />
  );

  return (
    <>
      {compact ? (
        <Button
          type="button"
          size="icon"
          variant={following ? "outline" : "default"}
          className={cn(
            "size-10 rounded-full",
            !following &&
              "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground",
            className,
          )}
          aria-label={following ? "Obunani bekor qilish" : "Obuna bo'lish"}
          aria-pressed={following}
          disabled={isLoading}
          onClick={handleClick}
        >
          {icon}
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant={following ? "outline" : "default"}
          className={cn(
            "gap-1.5 rounded-full px-4",
            !following &&
              "bg-nav-active text-nav-active-foreground hover:bg-nav-active-hover hover:text-nav-active-foreground",
            className,
          )}
          disabled={isLoading}
          onClick={handleClick}
        >
          {icon}
          {following ? "Obunani bekor qilish" : "Obuna bo'lish"}
        </Button>
      )}

      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
