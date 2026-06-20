"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { getRealtimeSocketOrigin } from "@/lib/realtime/socket-url";
import type { RealtimeInvalidatePayload } from "@/lib/realtime/types";
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

    socket.on("invalidate", handleInvalidate);

    return () => {
      socket.off("invalidate", handleInvalidate);
      socket.disconnect();
    };
  }, [accessToken, dispatch]);

  return null;
}
