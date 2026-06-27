"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { usersApi } from "@/features/users/api/users-api";
import { getRealtimeSocketOrigin } from "@/lib/realtime/socket-url";
import type {
  PlatformStatsPayload,
  RealtimeInvalidatePayload,
} from "@/lib/realtime/types";
import { baseApi } from "@/lib/store/api/base-api";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

type ApiTag = Parameters<typeof baseApi.util.invalidateTags>[0][number];

export function RealtimeListener() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const socket = io(`${getRealtimeSocketOrigin()}/realtime`, {
      transports: ["websocket", "polling"],
      auth: accessToken ? { token: accessToken } : {},
    });

    const handleInvalidate = (payload: RealtimeInvalidatePayload) => {
      if (!payload?.tags?.length) {
        return;
      }

      dispatch(
        baseApi.util.invalidateTags(payload.tags as ApiTag[]),
      );
    };

    const handlePlatformStats = (payload: PlatformStatsPayload) => {
      if (
        typeof payload?.onlineNow !== "number" ||
        typeof payload?.totalUsers !== "number"
      ) {
        return;
      }

      dispatch(
        usersApi.util.updateQueryData(
          "getPublicPlatformStats",
          undefined,
          () => payload,
        ),
      );
    };

    socket.on("invalidate", handleInvalidate);
    socket.on("platform-stats", handlePlatformStats);

    return () => {
      socket.off("invalidate", handleInvalidate);
      socket.off("platform-stats", handlePlatformStats);
      socket.disconnect();
    };
  }, [accessToken, dispatch]);

  return null;
}
