import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";
import { baseApi } from "@/lib/store/api/base-api";
import type { ArticleFeedResponse } from "@/features/articles/types";
import type {
  FollowersResponse,
  FollowResponse,
  PlatformPublicStats,
  PublicProfileResponse,
} from "@/features/users/types";

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicPlatformStats: builder.query<PlatformPublicStats, void>({
      query: () => "/users/platform-stats",
    }),
    getPublicProfile: builder.query<PublicProfileResponse, string>({
      query: (username) =>
        `/users/${encodeURIComponent(normalizeUsername(username))}`,
      providesTags: (_r, _e, username) => [
        { type: "UserProfile", id: normalizeUsername(username) },
      ],
    }),
    getUserArticles: builder.query<
      ArticleFeedResponse,
      { username: string; page?: number; limit?: number }
    >({
      query: ({ username, page = 1, limit = ARTICLE_FEED_PAGE_SIZE }) =>
        `/users/${encodeURIComponent(normalizeUsername(username))}/articles?page=${page}&limit=${limit}`,
      providesTags: (_r, _e, { username }) => [
        {
          type: "UserProfile",
          id: `${normalizeUsername(username)}-articles`,
        },
      ],
    }),
    getUserFollowers: builder.query<FollowersResponse, string>({
      query: (username) =>
        `/users/${encodeURIComponent(normalizeUsername(username))}/followers?limit=50`,
      providesTags: (_r, _e, username) => [
        { type: "UserProfile", id: `${normalizeUsername(username)}-followers` },
      ],
    }),
    toggleFollow: builder.mutation<FollowResponse, string>({
      query: (username) => ({
        url: `/users/${encodeURIComponent(normalizeUsername(username))}/follow`,
        method: "POST",
      }),
      async onQueryStarted(username, { dispatch, queryFulfilled }) {
        const normalized = normalizeUsername(username);
        const patchResult = dispatch(
          usersApi.util.updateQueryData(
            "getPublicProfile",
            normalized,
            (draft) => {
              const nextFollowing = !draft.isFollowing;
              draft.isFollowing = nextFollowing;
              draft.stats.followersCount = Math.max(
                0,
                draft.stats.followersCount + (nextFollowing ? 1 : -1),
              );
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            usersApi.util.updateQueryData(
              "getPublicProfile",
              normalized,
              (draft) => {
                draft.isFollowing = data.following;
                draft.stats.followersCount = data.followersCount;
              },
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_r, _e, username) => {
        const normalized = normalizeUsername(username);
        return [
          { type: "UserProfile", id: normalized },
          { type: "UserProfile", id: `${normalized}-followers` },
          { type: "Notification", id: "UNREAD_COUNT" },
        ];
      },
    }),
  }),
});

export const {
  useGetPublicPlatformStatsQuery,
  useGetPublicProfileQuery,
  useGetUserArticlesQuery,
  useLazyGetUserArticlesQuery,
  useGetUserFollowersQuery,
  useToggleFollowMutation,
} = usersApi;
