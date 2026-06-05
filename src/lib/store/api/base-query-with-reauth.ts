import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";
import {
  clearCredentials,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
} from "@/features/auth/slice/auth-slice";

type AuthTokensPayload = {
  accessToken: string;
  refreshToken: string;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<AuthTokensPayload | null> | null = null;

async function requestTokenRefresh(): Promise<AuthTokensPayload | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  return (await response.json()) as AuthTokensPayload;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const requestUrl =
    typeof args === "string" ? args : args.url?.toString() ?? "";

  if (requestUrl.includes("/auth/refresh")) {
    api.dispatch(clearCredentials());
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  const tokens = await refreshPromise;

  if (!tokens) {
    api.dispatch(clearCredentials());
    return result;
  }

  api.dispatch(setSessionTokens(tokens));

  const { baseApi } = await import("@/lib/store/api/base-api");
  api.dispatch(baseApi.util.invalidateTags(["UserProfile"]));

  return rawBaseQuery(args, api, extraOptions);
};
