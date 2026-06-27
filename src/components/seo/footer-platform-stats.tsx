"use client";

import { CircleIcon, UsersIcon } from "lucide-react";
import { useGetPublicPlatformStatsQuery } from "@/features/users/api/users-api";
import { formatCount } from "@/lib/format";
import { getDisplayedPlatformStats } from "@/lib/platform-stats";

export function FooterPlatformStats() {
  const { data, isSuccess } = useGetPublicPlatformStatsQuery();

  if (!isSuccess || !data) {
    return null;
  }

  const { onlineCount, totalUsers } = getDisplayedPlatformStats(data);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
        <span className="relative flex size-4 items-center justify-center">
          <CircleIcon
            className="size-2.5 fill-emerald-500 text-emerald-500"
            aria-hidden
          />
        </span>
        <span>
          Hozir onlayn:{" "}
          <span className="font-medium tabular-nums text-foreground">
            {formatCount(onlineCount)}
          </span>{" "}
          kishi
        </span>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
        <UsersIcon className="size-3.5 text-primary" aria-hidden />
        <span>
          Platforma foydalanuvchilari:{" "}
          <span className="font-medium tabular-nums text-foreground">
            {formatCount(totalUsers)}
          </span>
        </span>
      </div>
    </div>
  );
}
