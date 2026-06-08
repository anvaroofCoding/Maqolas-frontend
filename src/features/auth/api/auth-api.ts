import { createApi } from "@reduxjs/toolkit/query/react";
import {
  clearCredentials,
  setCredentials,
  setUser,
  setBan,
} from "@/features/auth/slice/auth-slice";
import type {
  AuthTokensResponse,
  BanInfo,
  MeResponse,
  UpdateProfilePayload,
} from "@/features/auth/types";
import { env } from "@/config/env";
import { baseQueryWithReauth } from "@/lib/store/api/base-query-with-reauth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AuthUser"],
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["AuthUser"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err: unknown) {
          const error = err as { error?: { status?: number; data?: unknown } };
          if (error?.error?.status === 403) {
            const data = error.error.data as Record<string, unknown> | undefined;
            if (data && typeof data.message === "string" && "isPermanent" in data) {
              dispatch(
                setBan({
                  message: data.message as string,
                  reason: (data.reason as string) ?? "",
                  expiresAt: (data.expiresAt as string | null) ?? null,
                  isPermanent: data.isPermanent as boolean,
                } satisfies BanInfo),
              );
            }
          }
        }
      },
    }),
    uploadAvatar: builder.mutation<MeResponse, FormData>({
      query: (body) => ({
        url: "/auth/me/avatar",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(data.user));
      },
      invalidatesTags: ["AuthUser"],
    }),
    updateProfile: builder.mutation<MeResponse, UpdateProfilePayload>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(data.user));
      },
      invalidatesTags: ["AuthUser"],
    }),
    googleTokenLogin: builder.mutation<AuthTokensResponse, { idToken: string }>(
      {
        query: (body) => ({
          url: "/auth/google/token",
          method: "POST",
          body,
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              }),
            );
          } catch {
            /* handled by UI */
          }
        },
      },
    ),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
        }
      },
      invalidatesTags: ["AuthUser"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGoogleTokenLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} = authApi;

export function getGoogleOAuthUrl() {
  return `${env.NEXT_PUBLIC_API_URL}/auth/google`;
}
