"use client";

import {
  BellIcon,
  MegaphoneIcon,
  MoonIcon,
  PenLineIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useGetUnreadNotificationCountQuery } from "@/features/notifications/api/notifications-api";
import {
  OPEN_NOTIFICATIONS_EVENT,
  OPEN_RANDOM_ARTICLE_EVENT,
  OPEN_SEARCH_EVENT,
} from "@/lib/keyboard-shortcuts/types";
import { shouldShowMobileDock } from "@/lib/mobile-dock";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

const dockIconClass =
  "relative flex size-11 shrink-0 items-center justify-center rounded-full text-white/75 transition-transform outline-none hover:text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-white/40";

export function SiteMobileDock() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLoggedIn = mounted && Boolean(accessToken);

  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !isLoggedIn,
  });
  const unreadCount = unreadData?.count ?? 0;

  useEffect(() => setMounted(true), []);

  if (!mounted || !shouldShowMobileDock(pathname)) {
    return null;
  }

  const isDark = resolvedTheme === "dark";
  const isWriteActive = pathname.startsWith("/yozish");

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      aria-label="Tezkor menyu"
      data-site-chrome
    >
      <div className="pointer-events-auto flex w-full max-w-md items-end justify-between rounded-[28px] bg-foreground px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/10 dark:bg-zinc-950/95 dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          className={dockIconClass}
          aria-label="Random maqola"
          data-tour="random-article"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(OPEN_RANDOM_ARTICLE_EVENT))
          }
        >
          <MegaphoneIcon className="size-5" aria-hidden />
        </button>

        <button
          type="button"
          className={dockIconClass}
          aria-label={isDark ? "Yorug' rejim" : "Qorong'i rejim"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? (
            <SunIcon className="size-5" aria-hidden />
          ) : (
            <MoonIcon className="size-5" aria-hidden />
          )}
        </button>

        <Link
          href="/yozish"
          aria-label="Yozish"
          data-tour="write-button"
          aria-current={isWriteActive ? "page" : undefined}
          className={cn(
            "-mt-6 flex size-14 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-lg ring-4 ring-foreground transition-transform active:scale-95 dark:ring-zinc-950/95",
            isWriteActive && "text-nav-active",
          )}
        >
          <PenLineIcon className="size-6" aria-hidden />
        </Link>

        <button
          type="button"
          className={dockIconClass}
          aria-label="Qidiruv"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT))
          }
        >
          <SearchIcon className="size-5" aria-hidden />
        </button>

        <button
          type="button"
          className={cn(dockIconClass, !isLoggedIn && "opacity-70")}
          aria-label="Bildirishnomalar"
          data-tour="notifications"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(OPEN_NOTIFICATIONS_EVENT))
          }
        >
          <BellIcon className="size-5" aria-hidden />
          {isLoggedIn && unreadCount > 0 ? (
            <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  );
}
