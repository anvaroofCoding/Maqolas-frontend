"use client";

import {
  ArrowLeftIcon,
  BellIcon,
  CloudSunIcon,
  MegaphoneIcon,
  MenuIcon,
  MoonIcon,
  PenLineIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ArticleSearchDialog } from "@/components/layout/article-search-dialog";
import { PromoReaderModal } from "@/components/promo-reader/promo-reader-modal";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { useSettings } from "@/components/providers/settings-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetUnreadNotificationCountQuery } from "@/features/notifications/api/notifications-api";
import { useNavbarWeather } from "@/hooks/use-navbar-weather";
import { navIconButtonClass } from "@/lib/layout";
import { WEATHER_DETAILS } from "@/lib/weather/details";
import { useAppSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

const mobileMenuItemClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/70 active:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50";

type MobileMenuView = "main" | "notifications";

export function NavbarMobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<MobileMenuView>("main");
  const [promoOpen, setPromoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const { settings } = useSettings();
  const weather = useNavbarWeather(settings.navbarWeatherEnabled);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLoggedIn = mounted && Boolean(accessToken);

  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !isLoggedIn,
  });
  const unreadCount = unreadData?.count ?? 0;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setView("main");
    }
  }, [open]);

  const isDark = resolvedTheme === "dark";
  const themeLabel = !mounted
    ? "Mavzu rejimi"
    : isDark
      ? "Yorug' rejim"
      : "Qorong'i rejim";

  function closeAndRun(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(navIconButtonClass, className)}
            aria-label="Menyu"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          showCloseButton={view === "main"}
          className="gap-0 p-0"
        >
          {view === "main" ? (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle>Menyu</SheetTitle>
              </SheetHeader>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-2">
                {settings.navbarWeatherEnabled ? (
                  <div className="mb-1 rounded-lg bg-muted/40 px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <CloudSunIcon className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Ob-havo</p>
                        {weather ? (
                          <p className="truncate text-xs text-muted-foreground">
                            {WEATHER_DETAILS[weather.condition].label} ·{" "}
                            {weather.temperature}°C · {weather.locationLabel}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Yuklanmoqda...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}

                <nav className="space-y-0.5" aria-label="Mobil menyu">
                  <button
                    type="button"
                    className={mobileMenuItemClass}
                    onClick={() =>
                      closeAndRun(() => {
                        setPromoOpen(true);
                      })
                    }
                  >
                    <MegaphoneIcon className="size-4 text-muted-foreground" />
                    Random maqola
                  </button>

                  <button
                    type="button"
                    className={mobileMenuItemClass}
                    disabled={!mounted}
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                  >
                    {mounted && isDark ? (
                      <SunIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <MoonIcon className="size-4 text-muted-foreground" />
                    )}
                    {themeLabel}
                  </button>

                  <button
                    type="button"
                    className={mobileMenuItemClass}
                    onClick={() =>
                      closeAndRun(() => {
                        setSearchOpen(true);
                      })
                    }
                  >
                    <SearchIcon className="size-4 text-muted-foreground" />
                    Qidiruv
                  </button>

                  <Link
                    href="/yozish"
                    className={mobileMenuItemClass}
                    onClick={() => setOpen(false)}
                  >
                    <PenLineIcon className="size-4 text-muted-foreground" />
                    Yozish
                  </Link>

                  <button
                    type="button"
                    className={cn(mobileMenuItemClass, !isLoggedIn && "opacity-60")}
                    disabled={!isLoggedIn}
                    onClick={() => {
                      if (!isLoggedIn) return;
                      setView("notifications");
                    }}
                  >
                    <BellIcon className="size-4 text-muted-foreground" />
                    <span className="flex-1">Bildirishnomalar</span>
                    {isLoggedIn && unreadCount > 0 ? (
                      <span className="rounded-full bg-nav-active px-1.5 py-0.5 text-[10px] font-semibold text-nav-active-foreground">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </button>
                  {!isLoggedIn ? (
                    <p className="px-3 pb-1 text-xs text-muted-foreground">
                      Bildirishnomalar uchun tizimga kiring
                    </p>
                  ) : null}
                </nav>
              </div>
            </>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center gap-2 border-b border-border p-4 pr-12">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  aria-label="Orqaga"
                  onClick={() => setView("main")}
                >
                  <ArrowLeftIcon />
                </Button>
                <p className="text-base font-semibold">Bildirishnomalar</p>
              </div>
              <NotificationPanel
                active={open && view === "notifications"}
                enabled={isLoggedIn}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PromoReaderModal open={promoOpen} onOpenChange={setPromoOpen} />
      {mounted ? (
        <ArticleSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      ) : null}
    </>
  );
}
