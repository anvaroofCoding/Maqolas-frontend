"use client";

import { FileTextIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/features/auth/api/auth-api";
import { useAppSelector } from "@/lib/store/hooks";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HOVER_OPEN_DELAY_MS = 120;
const HOVER_CLOSE_DELAY_MS = 280;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileMenuTrigger({
  label,
  avatarUrl,
  displayName,
  onClick,
}: {
  label?: string;
  avatarUrl?: string;
  displayName?: string;
  onClick?: () => void;
}) {
  const initials = displayName ? getInitials(displayName) : "M";

  return (
    <Button
      type="button"
      variant="ghost"
      size={label ? "sm" : "icon"}
      className={cn(
        label ? "gap-2 px-2.5" : "rounded-full p-0",
        navIconButtonClass,
      )}
      aria-label={label ?? "Profil menyusi"}
      onClick={onClick}
    >
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : (
        <Avatar size="sm">
          <AvatarImage src={avatarUrl} alt="Profil" />
          <AvatarFallback className="bg-nav-active/15 text-xs font-medium text-nav-active dark:bg-nav-active/25 dark:text-nav-active-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </Button>
  );
}

export function ProfileMenu() {
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });
  const [logout] = useLogoutMutation();

  const activeUser = meData?.user ?? user;

  useEffect(() => setMounted(true), []);

  const clearHoverTimers = useCallback(() => {
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
  }, []);

  const handleHoverEnter = useCallback(() => {
    if (isAuthenticated) return;
    clearHoverTimers();
    hoverOpenTimer.current = setTimeout(() => {
      setLoginOpen(true);
    }, HOVER_OPEN_DELAY_MS);
  }, [clearHoverTimers, isAuthenticated]);

  const handleHoverLeave = useCallback(() => {
    if (isAuthenticated) return;
    clearHoverTimers();
    hoverCloseTimer.current = setTimeout(() => {
      setLoginOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearHoverTimers, isAuthenticated]);

  const handleModalHoverEnter = useCallback(() => {
    clearHoverTimers();
  }, [clearHoverTimers]);

  useEffect(() => () => clearHoverTimers(), [clearHoverTimers]);

  if (!mounted) {
    return <ProfileMenuTrigger />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <div
          className="inline-flex"
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          <ProfileMenuTrigger
            label="Kirish"
            onClick={() => setLoginOpen(true)}
          />
        </div>

        <div onMouseEnter={handleModalHoverEnter} onMouseLeave={handleHoverLeave}>
          <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
        </div>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ProfileMenuTrigger
          avatarUrl={activeUser?.avatarUrl}
          displayName={activeUser?.displayName}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">
            {activeUser?.displayName ?? "Foydalanuvchi"}
          </p>
          <p className="text-xs text-muted-foreground">
            {activeUser?.email ?? ""}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileTextIcon />
          Maqolalarim
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void logout()}
        >
          <LogOutIcon />
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
