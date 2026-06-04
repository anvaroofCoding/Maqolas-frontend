"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useLazyGetMeQuery } from "@/features/auth/api/auth-api";
import { setCredentials } from "@/features/auth/slice/auth-slice";
import { useAppDispatch } from "@/lib/store/hooks";

function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [fetchMe] = useLazyGetMeQuery();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken") ?? "";

    if (!accessToken) {
      router.replace("/");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("maqolas_access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("maqolas_refresh_token", refreshToken);
      }
    }

    void fetchMe()
      .unwrap()
      .then((data) => {
        dispatch(
          setCredentials({
            user: data.user,
            accessToken,
            refreshToken,
          }),
        );
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("maqolas_access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("maqolas_refresh_token", refreshToken);
          }
        }
      })
      .finally(() => {
        router.replace("/");
      });
  }, [dispatch, fetchMe, router, searchParams]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Kirish yakunlanmoqda...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  );
}
