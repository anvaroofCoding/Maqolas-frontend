import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";
import { isTokenExpired } from "@/lib/auth/token";
import { refreshSessionTokens } from "@/lib/auth/refresh-session";
import {
  clearCredentials,
  getAccessToken,
  getRefreshToken,
  setSessionTokens,
  setBan,
} from "@/features/auth/slice/auth-slice";
import type { BanInfo } from "@/features/auth/types";

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

async function refreshSession(
  api: Parameters<BaseQueryFn>[1],
): Promise<boolean> {
  const tokens = await refreshSessionTokens();
  if (!tokens) {
    api.dispatch(clearCredentials());
    return false;
  }

  api.dispatch(setSessionTokens(tokens));

  const { baseApi } = await import("@/lib/store/api/base-api");
  api.dispatch(baseApi.util.invalidateTags(["UserProfile", "AuthUser"]));

  return true;
}

async function ensureFreshAccessToken(
  api: Parameters<BaseQueryFn>[1],
): Promise<boolean> {
  const accessToken = getAccessToken();
  if (!accessToken) return false;
  if (!isTokenExpired(accessToken)) return true;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    api.dispatch(clearCredentials());
    return false;
  }

  return refreshSession(api);
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const requestUrl =
    typeof args === "string" ? args : args.url?.toString() ?? "";

  const isAuthEndpoint =
    requestUrl.includes("/auth/refresh") ||
    requestUrl.includes("/auth/logout") ||
    requestUrl.includes("/auth/google");

  if (!isAuthEndpoint && getAccessToken()) {
    await ensureFreshAccessToken(api);
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    const data = result.error.data as Record<string, unknown> | undefined;
    if (data && typeof data.message === "string" && "isPermanent" in data) {
      api.dispatch(
        setBan({
          message: data.message as string,
          reason: (data.reason as string) ?? "",
          expiresAt: (data.expiresAt as string | null) ?? null,
          isPermanent: data.isPermanent as boolean,
        } satisfies BanInfo),
      );
    }
    return result;
  }

  if (result.error?.status !== 401) {
    return result;
  }

  if (requestUrl.includes("/auth/logout")) {
    return result;
  }

  if (requestUrl.includes("/auth/refresh")) {
    api.dispatch(clearCredentials());
    return result;
  }

  const refreshed = await refreshSession(api);
  if (!refreshed) {
    return result;
  }

  return rawBaseQuery(args, api, extraOptions);
};
