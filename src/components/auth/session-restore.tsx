"use client";

import { useEffect, useRef } from "react";
import { env } from "@/config/env";
import {
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from "@/features/auth/slice/auth-slice";
import { isTokenExpired } from "@/lib/auth/token";
import { useAppDispatch } from "@/lib/store/hooks";

async function restoreSessionFromRefreshToken(
  dispatch: ReturnType<typeof useAppDispatch>,
) {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!refreshToken || isTokenExpired(refreshToken)) {
    return;
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return;
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return;

  const tokens = (await response.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  dispatch(setSessionTokens(tokens));
}

export function SessionRestore() {
  const dispatch = useAppDispatch();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void restoreSessionFromRefreshToken(dispatch);
  }, [dispatch]);

  return null;
}
