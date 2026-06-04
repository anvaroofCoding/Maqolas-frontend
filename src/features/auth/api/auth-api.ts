import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  clearCredentials,
  getAccessToken,
  setCredentials,
} from "@/features/auth/slice/auth-slice";
import type { AuthTokensResponse, AuthUser } from "@/features/auth/types";
import { env } from "@/config/env";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["AuthUser"],
  endpoints: (builder) => ({
    getMe: builder.query<{ user: AuthUser }, void>({
      query: () => "/auth/me",
      providesTags: ["AuthUser"],
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
} = authApi;

export function getGoogleOAuthUrl() {
  return `${env.NEXT_PUBLIC_API_URL}/auth/google`;
}
