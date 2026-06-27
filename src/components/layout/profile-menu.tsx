"use client";

import {
  FileTextIcon,
  InfoIcon,
  LogOutIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { useSettings } from "@/components/providers/settings-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useGetMeQuery,
  useLogoutMutation,
} from "@/features/auth/api/auth-api";
import { useAppSelector } from "@/lib/store/hooks";
import { navIconButtonClass } from "@/lib/layout";
import { getUserInitials } from "@/lib/user";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const profileTriggerClass = cn(
  navIconButtonClass,
  "rounded-full p-0",
  "data-[state=open]:bg-muted data-[state=open]:ring-2 data-[state=open]:ring-ring/40",
);

const ProfileAvatarTrigger = forwardRef<
  HTMLButtonElement,
  {
    avatarUrl?: string;
    displayName?: string;
  } & React.ComponentProps<"button">
>(function ProfileAvatarTrigger(
  { avatarUrl, displayName, className, ...props },
  ref,
) {
  const initials = displayName ? getUserInitials(displayName) : "M";

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      className={cn(profileTriggerClass, className)}
      aria-label="Profil menyusi"
      {...props}
    >
      <Avatar size="sm">
        <AvatarImage src={avatarUrl} alt={displayName ?? "Profil"} />
        <AvatarFallback className="bg-nav-active/15 text-xs font-medium text-nav-active">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
});

export function ProfileMenu() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLoggedIn = isAuthenticated || Boolean(accessToken);

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !mounted || !accessToken,
  });
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { openSettings } = useSettings();

  const activeUser = meData?.user ?? user;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Mahalliy sessiya baribir tozalanadi
    } finally {
      toast.success("Tizimdan chiqdingiz");
      router.replace("/");
      router.refresh();
    }
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <NavbarTooltip label="Profil" disabled>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={profileTriggerClass}
          aria-label="Profil"
          disabled
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-muted text-xs">···</AvatarFallback>
          </Avatar>
        </Button>
      </NavbarTooltip>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <NavbarTooltip label="Kirish" hint="Hisobingizga kiring">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("gap-2 px-2.5", navIconButtonClass)}
            aria-label="Kirish"
            onClick={() => setLoginOpen(true)}
          >
            <span className="text-sm font-medium text-foreground">Kirish</span>
          </Button>
        </NavbarTooltip>
        <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      </>
    );
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <NavbarTooltip
        label="Profil menyusi"
        hint={activeUser?.displayName ?? "Hisobingiz"}
        disabled={menuOpen}
      >
        <DropdownMenuTrigger asChild>
          <ProfileAvatarTrigger
            avatarUrl={activeUser?.avatarUrl}
            displayName={activeUser?.displayName}
          />
        </DropdownMenuTrigger>
      </NavbarTooltip>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">
            {activeUser?.displayName ?? "Foydalanuvchi"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {activeUser?.email ?? ""}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/profil")}
        >
          <UserIcon />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/profil?tab=maqolalarim")}
        >
          <FileTextIcon />
          Maqolalarim
        </DropdownMenuItem>
        {activeUser?.role === "super_admin" ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => router.push("/admin")}
          >
            <ShieldCheckIcon />
            Admin panel
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            openSettings();
          }}
        >
          <SettingsIcon />
          Sozlamalar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/dastur-haqida")}
        >
          <InfoIcon />
          Dastur haqida
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/foydalanish-shartlari")}
        >
          <ScrollTextIcon />
          Foydalanish shartlari
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/maxfiylik-siyosati")}
        >
          <ShieldIcon />
          Maxfiylik siyosati
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={isLoggingOut}
          onSelect={(event) => {
            event.preventDefault();
            void handleLogout();
          }}
        >
          <LogOutIcon />
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
