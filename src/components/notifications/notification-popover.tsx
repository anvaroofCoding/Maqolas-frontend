"use client";

import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { NavbarTooltip } from "@/components/layout/navbar-tooltip";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetUnreadNotificationCountQuery } from "@/features/notifications/api/notifications-api";
import { OPEN_NOTIFICATIONS_EVENT } from "@/lib/keyboard-shortcuts/types";
import { navIconButtonClass } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function NotificationPopover() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !accessToken) return;

    const handleOpen = () => {
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      setOpen(true);
    };
    window.addEventListener(OPEN_NOTIFICATIONS_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_NOTIFICATIONS_EVENT, handleOpen);
  }, [accessToken, mounted]);

  const isActive = mounted && Boolean(accessToken);

  const { data: unreadData } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !isActive,
  });

  const unreadCount = unreadData?.count ?? 0;

  if (!isActive) {
    return (
      <NavbarTooltip label="Bildirishnomalar" hint="Kirish talab qilinadi">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("relative", navIconButtonClass)}
          aria-label="Bildirishnomalar"
          disabled={!mounted}
          data-tour="notifications"
        >
          <BellIcon />
        </Button>
      </NavbarTooltip>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <NavbarTooltip
        label="Bildirishnomalar"
        hint={
          unreadCount > 0
            ? `${unreadCount > 99 ? "99+" : unreadCount} ta o'qilmagan`
            : "Yangiliklar va xabarlar"
        }
        disabled={open}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("relative", navIconButtonClass)}
            aria-label="Bildirishnomalar"
            data-tour="notifications"
          >
            <BellIcon />
            {unreadCount > 0 ? (
              <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-nav-active px-1 py-0.5 text-[10px] font-semibold leading-none text-nav-active-foreground ring-2 ring-background">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
      </NavbarTooltip>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden p-0"
      >
        <NotificationPanel
          active={open}
          listClassName="max-h-[min(24rem,60vh)]"
        />
      </PopoverContent>
    </Popover>
  );
}
