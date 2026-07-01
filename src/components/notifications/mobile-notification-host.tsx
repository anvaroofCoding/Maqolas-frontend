"use client";

import { useEffect, useState } from "react";
import { AuthLoginModal } from "@/components/auth/auth-login-modal";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { OPEN_NOTIFICATIONS_EVENT } from "@/lib/keyboard-shortcuts/types";
import { useAppSelector } from "@/lib/store/hooks";

export function MobileNotificationHost() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isLoggedIn = mounted && Boolean(accessToken);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const handleOpen = () => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      if (!isLoggedIn) {
        setLoginOpen(true);
        return;
      }
      setOpen(true);
    };

    window.addEventListener(OPEN_NOTIFICATIONS_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_NOTIFICATIONS_EVENT, handleOpen);
  }, [isLoggedIn, mounted]);

  if (!mounted) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          showCloseButton
          className="flex h-[min(88dvh,640px)] flex-col gap-0 rounded-t-2xl p-0 md:hidden"
        >
          <NotificationPanel active={open} enabled={isLoggedIn} />
        </SheetContent>
      </Sheet>
      <AuthLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
