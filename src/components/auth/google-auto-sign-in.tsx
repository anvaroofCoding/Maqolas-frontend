"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { env } from "@/config/env";
import { useGoogleTokenLoginMutation } from "@/features/auth/api/auth-api";
import { setSilentAuthAttempted } from "@/features/auth/slice/auth-slice";
import { clearManualLogout } from "@/lib/auth/logout-client";
import { shouldAttemptAutoGoogleAuth } from "@/lib/auth/google-silent-auth";
import {
  isGoogleGisOriginAllowed,
  showGoogleOneTap,
  type GoogleOneTapDismissReason,
} from "@/lib/auth/google-gis-origins";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

const RETRY_DELAYS_MS = [0, 5_000, 15_000, 30_000];

export function GoogleAutoSignIn() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const silentAuthAttempted = useAppSelector(
    (state) => state.auth.silentAuthAttempted,
  );
  const attemptRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [googleTokenLogin] = useGoogleTokenLoginMutation();

  const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const oneTapEnabled = process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED !== "false";

  useEffect(() => {
    if (!hydrated || silentAuthAttempted) {
      return;
    }

    if (!shouldAttemptAutoGoogleAuth(pathname)) {
      if (accessToken) {
        dispatch(setSilentAuthAttempted());
      }
      return;
    }

    if (!clientId || !oneTapEnabled || !isGoogleGisOriginAllowed()) {
      dispatch(setSilentAuthAttempted());
      return;
    }

    let cancelled = false;

    const finish = () => {
      if (!cancelled) {
        dispatch(setSilentAuthAttempted());
      }
    };

    const scheduleRetry = (reason: GoogleOneTapDismissReason) => {
      if (cancelled || reason !== "unregistered_origin") {
        finish();
        return;
      }

      attemptRef.current += 1;
      if (attemptRef.current >= RETRY_DELAYS_MS.length) {
        finish();
        return;
      }

      const delay = RETRY_DELAYS_MS[attemptRef.current];
      retryTimerRef.current = setTimeout(() => {
        if (!cancelled) void runPrompt();
      }, delay);
    };

    const runPrompt = async () => {
      if (cancelled) return;

      try {
        window.google?.accounts?.id?.cancel();
      } catch {
        /* script yuklanmagan */
      }

      await showGoogleOneTap({
        clientId,
        onCredential: async (idToken) => {
          if (cancelled) return;

          try {
            clearManualLogout();
            await googleTokenLogin({ idToken }).unwrap();
          } catch {
            /* login xatosi */
          } finally {
            finish();
          }
        },
        onDismiss: (reason) => {
          if (cancelled) return;

          if (reason === "dismissed" || reason === "skipped") {
            finish();
            return;
          }

          scheduleRetry(reason);
        },
      });
    };

    void runPrompt();

    return () => {
      cancelled = true;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      try {
        window.google?.accounts?.id?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, [
    accessToken,
    clientId,
    dispatch,
    googleTokenLogin,
    hydrated,
    oneTapEnabled,
    pathname,
    silentAuthAttempted,
  ]);

  return null;
}
