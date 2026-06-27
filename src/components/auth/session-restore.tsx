"use client";

import { useEffect, useRef } from "react";
import {
  clearCredentials,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from "@/features/auth/slice/auth-slice";
import { refreshSessionTokens } from "@/lib/auth/refresh-session";
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

  const tokens = await refreshSessionTokens();
  if (!tokens) {
    dispatch(clearCredentials());
    return;
  }

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
