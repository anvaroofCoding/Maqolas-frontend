"use client";

import { useEffect } from "react";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { setCredentials, setUser } from "@/features/auth/slice/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const { data, isSuccess } = useGetMeQuery(undefined, {
    skip: !accessToken || Boolean(user),
  });

  useEffect(() => {
    if (isSuccess && data?.user && accessToken) {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken,
          refreshToken: refreshToken ?? "",
        }),
      );
    } else if (isSuccess && data?.user) {
      dispatch(setUser(data.user));
    }
  }, [isSuccess, data, accessToken, refreshToken, dispatch]);

  return children;
}
