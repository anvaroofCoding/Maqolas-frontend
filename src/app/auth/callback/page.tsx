"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useLazyGetMeQuery } from "@/features/auth/api/auth-api";
import { clearManualLogout } from "@/lib/auth/logout-client";
import {
  setCredentials,
  setSessionTokens,
} from "@/features/auth/slice/auth-slice";
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

    async function finishLogin() {
      const error = searchParams.get("error");
      const errorMessage = searchParams.get("message");

      if (error) {
        const params = new URLSearchParams({ auth_error: error });
        if (errorMessage) params.set("auth_message", errorMessage);
        router.replace(`/?${params.toString()}`);
        return;
      }

      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken") ?? "";

      if (!accessToken) {
        router.replace("/?auth_error=missing_token");
        return;
      }

      dispatch(setSessionTokens({ accessToken, refreshToken }));
      clearManualLogout();

      try {
        const data = await fetchMe().unwrap();
        dispatch(
          setCredentials({
            user: data.user,
            accessToken,
            refreshToken,
          }),
        );
      } catch {
        /* token saqlangan; AuthProvider getMe qayta urinadi */
      }

      router.replace("/");
    }

    void finishLogin();
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
