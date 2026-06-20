"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/components/providers/settings-provider";
import { useGetUnreadNotificationCountQuery } from "@/features/notifications/api/notifications-api";
import { playNotificationSound } from "@/lib/settings/notification-sounds";
import { useAppSelector } from "@/lib/store/hooks";

export function NotificationSoundListener() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { settings } = useSettings();
  const previousCountRef = useRef<number | null>(null);
  const isFirstPollRef = useRef(true);

  const { data } = useGetUnreadNotificationCountQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (!accessToken) {
      previousCountRef.current = null;
      isFirstPollRef.current = true;
      return;
    }

    const count = data?.count ?? 0;

    if (isFirstPollRef.current) {
      previousCountRef.current = count;
      isFirstPollRef.current = false;
      return;
    }

    const previous = previousCountRef.current ?? 0;
    if (count > previous) {
      playNotificationSound(settings.notificationSoundId);
    }

    previousCountRef.current = count;
  }, [accessToken, data?.count, settings.notificationSoundId]);

  return null;
}
