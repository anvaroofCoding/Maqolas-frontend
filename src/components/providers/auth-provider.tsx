"use client";

import { useEffect, useRef } from "react";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import {
  hydrateAuthFromStorage,
  setCredentials,
} from "@/features/auth/slice/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { GoogleAutoSignIn } from "@/components/auth/google-auto-sign-in";
import { BannedScreen } from "@/components/layout/banned-screen";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const ban = useAppSelector((state) => state.auth.ban);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      dispatch(hydrateAuthFromStorage());
    }
  }, [dispatch]);

  const { data, isSuccess } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (!isSuccess || !data?.user || !accessToken) return;
    if (
      user?.id === data.user.id &&
      user.displayName === data.user.displayName &&
      user.role === data.user.role
    ) {
      return;
    }

    dispatch(
      setCredentials({
        user: data.user,
        accessToken,
        refreshToken: refreshToken ?? "",
      }),
    );
  }, [isSuccess, data, accessToken, refreshToken, user, dispatch]);

  if (ban) {
    return <BannedScreen ban={ban} />;
  }

  return (
    <>
      <GoogleAutoSignIn />
      {children}
    </>
  );
}
