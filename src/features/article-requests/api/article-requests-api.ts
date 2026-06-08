import { baseApi } from "@/lib/store/api/base-api";
import type {
  ArticleRequest,
  ArticleRequestsResponse,
  CreateArticleRequestPayload,
  TrendingArticleRequestsResponse,
} from "@/features/article-requests/types";

export const articleRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTrendingArticleRequests: builder.query<
      TrendingArticleRequestsResponse,
      { limit?: number } | void
    >({
      query: (params) =>
        `/article-requests/trending?limit=${params?.limit ?? 5}`,
      providesTags: [{ type: "ArticleRequest", id: "TRENDING" }],
    }),
    listAllArticleRequests: builder.query<
      ArticleRequestsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? 20));
        return `/article-requests/all?${searchParams.toString()}`;
      },
      providesTags: [{ type: "ArticleRequest", id: "ALL" }],
    }),
    listArticleRequests: builder.query<
      ArticleRequestsResponse,
      { author: string; page?: number; limit?: number }
    >({
      query: ({ author, page = 1, limit = 20 }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("author", author);
        searchParams.set("page", String(page));
        searchParams.set("limit", String(limit));
        return `/article-requests?${searchParams.toString()}`;
      },
      providesTags: (_r, _e, { author }) => [
        { type: "ArticleRequest", id: author.toLowerCase() },
      ],
    }),
    createArticleRequest: builder.mutation<
      { request: ArticleRequest; pending?: boolean },
      CreateArticleRequestPayload
    >({
      query: (body) => ({
        url: "/article-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, _error, { authorUsername }) =>
        result?.pending
          ? []
          : [
              ...(authorUsername
                ? [
                    {
                      type: "ArticleRequest" as const,
                      id: authorUsername.toLowerCase(),
                    },
                  ]
                : []),
              { type: "ArticleRequest", id: "TRENDING" },
              { type: "ArticleRequest", id: "ALL" },
            ],
    }),
    toggleArticleRequestLike: builder.mutation<
      { liked: boolean; likeCount: number },
      { id: string; authorUsername?: string }
    >({
      query: ({ id }) => ({
        url: `/article-requests/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { authorUsername }) => [
        ...(authorUsername
          ? [{ type: "ArticleRequest" as const, id: authorUsername.toLowerCase() }]
          : []),
        { type: "ArticleRequest", id: "TRENDING" },
        { type: "ArticleRequest", id: "ALL" },
      ],
    }),
    updateArticleRequestNote: builder.mutation<
      { request: ArticleRequest },
      { id: string; authorUsername: string; authorNote: string }
    >({
      query: ({ id, authorNote }) => ({
        url: `/article-requests/${id}/note`,
        method: "PATCH",
        body: { authorNote },
      }),
      invalidatesTags: (_r, _e, { authorUsername }) =>
        authorUsername
          ? [{ type: "ArticleRequest", id: authorUsername.toLowerCase() }]
          : [],
    }),
  }),
});

export const {
  useListTrendingArticleRequestsQuery,
  useListAllArticleRequestsQuery,
  useListArticleRequestsQuery,
  useCreateArticleRequestMutation,
  useToggleArticleRequestLikeMutation,
  useUpdateArticleRequestNoteMutation,
} = articleRequestsApi;
