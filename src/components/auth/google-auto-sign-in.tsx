"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { env } from "@/config/env";
import { useGoogleTokenLoginMutation } from "@/features/auth/api/auth-api";
import { setSilentAuthAttempted } from "@/features/auth/slice/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

const GIS_SCRIPT_ID = "google-gsi-client";
const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window unavailable"));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existing = document.getElementById(GIS_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Google script failed")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script failed"));
    document.head.appendChild(script);
  });
}

export function GoogleAutoSignIn() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const silentAuthAttempted = useAppSelector(
    (state) => state.auth.silentAuthAttempted,
  );
  const started = useRef(false);
  const finished = useRef(false);
  const [googleTokenLogin] = useGoogleTokenLoginMutation();

  const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (silentAuthAttempted || started.current) {
      return;
    }

    const finishAttempt = () => {
      if (finished.current) return;
      finished.current = true;
      dispatch(setSilentAuthAttempted());
    };

    if (!clientId) {
      finishAttempt();
      return;
    }

    if (accessToken) {
      finishAttempt();
      return;
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
      finishAttempt();
      return;
    }

    started.current = true;

    void (async () => {
      try {
        await loadGsiScript();

        const googleId = window.google?.accounts?.id;
        if (!googleId) {
          finishAttempt();
          return;
        }

        googleId.initialize({
          client_id: clientId,
          auto_select: true,
          cancel_on_tap_outside: false,
          itp_support: true,
          callback: (response) => {
            void (async () => {
              try {
                await googleTokenLogin({
                  idToken: response.credential,
                }).unwrap();
              } catch {
                /* silent */
              } finally {
                finishAttempt();
              }
            })();
          },
        });

        googleId.prompt((notification) => {
          if (
            notification.isNotDisplayed() ||
            notification.isSkippedMoment() ||
            notification.isDismissedMoment()
          ) {
            finishAttempt();
          }
        });
      } catch {
        finishAttempt();
      }
    })();
  }, [
    accessToken,
    clientId,
    dispatch,
    googleTokenLogin,
    pathname,
    silentAuthAttempted,
  ]);

  return null;
}
