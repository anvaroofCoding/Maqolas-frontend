import type { PlatformPublicStats } from "@/features/users/types";

export function getDisplayedPlatformStats(stats: PlatformPublicStats) {
  return {
    onlineCount: stats.onlineNow,
    totalUsers: stats.totalUsers,
  };
}
