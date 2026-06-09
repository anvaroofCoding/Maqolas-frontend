import { ARTICLE_FEED_PAGE_SIZE } from "@/lib/articles/constants";
import { baseApi } from "@/lib/store/api/base-api";
import type {
  Article,
  ArticleCommentsResponse,
  ArticleEngagement,
  ArticleFeedResponse,
  ArticleStatus,
  ArticleSummary,
  ArticleSearchResponse,
  ArticleComment,
  PopularCommentsResponse,
  MyArticlesResponse,
  SaveArticlePayload,
} from "@/features/articles/types";

type FeedQuery = {
  sort?: "popular" | "newest" | "forYou";
  category?: string;
  page?: number;
  limit?: number;
};

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyArticles: builder.query<
      MyArticlesResponse,
      { status?: ArticleStatus; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? 20));
        if (params?.status) {
          searchParams.set("status", params.status);
        }
        return `/articles/mine?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Article", id: "MINE" }],
    }),
    listSavedArticles: builder.query<ArticleFeedResponse, FeedQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? ARTICLE_FEED_PAGE_SIZE));
        return `/articles/saved?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Article", id: "SAVED" }],
    }),
    listArticles: builder.query<ArticleFeedResponse, FeedQuery | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("sort", params?.sort ?? "popular");
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? ARTICLE_FEED_PAGE_SIZE));
        if (params?.category) {
          searchParams.set("category", params.category);
        }
        return `/articles/feed?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Article", id: "LIST" }],
    }),
    searchArticles: builder.query<
      ArticleSearchResponse,
      { q: string; limit?: number }
    >({
      query: ({ q, limit = 10 }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("q", q);
        searchParams.set("limit", String(limit));
        return `/articles/search?${searchParams.toString()}`;
      },
    }),
    getArticleBySlug: builder.query<{ article: ArticleSummary }, string>({
      query: (slug) => `/articles/slug/${encodeURIComponent(slug)}`,
      providesTags: (_r, _e, slug) => [{ type: "Article", id: `slug-${slug}` }],
    }),
    createArticle: builder.mutation<{ article: Article }, SaveArticlePayload>({
      query: (body) => ({
        url: "/articles",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Article", id: "LIST" },
        { type: "Article", id: "MINE" },
      ],
    }),
    getArticle: builder.query<{ article: Article }, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Article", id }],
    }),
    updateArticle: builder.mutation<
      { article: Article },
      { id: string; body: SaveArticlePayload }
    >({
      query: ({ id, body }) => ({
        url: `/articles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Article", id },
        { type: "Article", id: "MINE" },
      ],
    }),
    deleteArticle: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Article", id: "LIST" },
        { type: "Article", id: "MINE" },
        { type: "Article", id: "SAVED" },
      ],
    }),
    submitArticle: builder.mutation<
      { article: Article },
      { id: string; body: SaveArticlePayload }
    >({
      query: ({ id, body }) => ({
        url: `/articles/${id}/submit`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Article", id },
        { type: "Article", id: "MINE" },
        { type: "Article", id: "LIST" },
      ],
    }),
    toggleArticleSave: builder.mutation<{ saved: boolean }, string>({
      query: (id) => ({
        url: `/articles/${id}/save`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Article", id: `engagement-${id}` },
        { type: "Article", id: "SAVED" },
      ],
    }),
    getArticleEngagement: builder.query<ArticleEngagement, string>({
      query: (id) => `/articles/${id}/engagement`,
      providesTags: (_r, _e, id) => [{ type: "Article", id: `engagement-${id}` }],
    }),
    toggleArticleLike: builder.mutation<
      { liked: boolean; likeCount: number },
      string
    >({
      query: (id) => ({
        url: `/articles/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Article", id: `engagement-${id}` },
        { type: "Article", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),
    getArticleComments: builder.query<
      ArticleCommentsResponse,
      { articleId: string; page?: number }
    >({
      query: ({ articleId, page = 1 }) =>
        `/articles/${articleId}/comments?page=${page}`,
      providesTags: (_r, _e, { articleId }) => [
        { type: "Comment", id: articleId },
      ],
    }),
    createArticleComment: builder.mutation<
      { comment: ArticleComment; commentCount: number; pending?: boolean },
      { articleId: string; content: string; parentId?: string }
    >({
      query: ({ articleId, content, parentId }) => ({
        url: `/articles/${articleId}/comments`,
        method: "POST",
        body: { content, parentId },
      }),
      invalidatesTags: (_result, _error, { articleId }) =>
        _result?.pending
          ? []
          : [
              { type: "Comment", id: articleId },
              { type: "Article", id: `engagement-${articleId}` },
              { type: "Article", id: "LIST" },
              { type: "Notification", id: "UNREAD_COUNT" },
            ],
    }),
    getPopularComments: builder.query<PopularCommentsResponse, { limit?: number } | void>({
      query: (params) =>
        `/articles/comments/popular?limit=${params?.limit ?? 5}`,
      providesTags: [{ type: "Comment", id: "POPULAR" }],
    }),
    toggleCommentLike: builder.mutation<
      { liked: boolean; likeCount: number },
      { articleId: string; commentId: string }
    >({
      query: ({ articleId, commentId }) => ({
        url: `/articles/${articleId}/comments/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, { articleId }) => [
        { type: "Comment", id: articleId },
        { type: "Comment", id: "POPULAR" },
      ],
    }),
    reportComment: builder.mutation<
      { report: unknown },
      { articleId: string; commentId: string; reason?: string }
    >({
      query: ({ articleId, commentId, reason }) => ({
        url: `/articles/${articleId}/comments/${commentId}/report`,
        method: "POST",
        body: { reason },
      }),
    }),
    deleteArticleComment: builder.mutation<
      { deleted: boolean; commentCount: number },
      { articleId: string; commentId: string }
    >({
      query: ({ articleId, commentId }) => ({
        url: `/articles/${articleId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { articleId }) => [
        { type: "Comment", id: articleId },
        { type: "Article", id: `engagement-${articleId}` },
        { type: "Article", id: "LIST" },
      ],
    }),
    uploadArticleImage: builder.mutation<{ url: string }, FormData>({
      query: (body) => ({
        url: "/articles/upload-image",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useGetArticleQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useSubmitArticleMutation,
  useListArticlesQuery,
  useLazyListArticlesQuery,
  useSearchArticlesQuery,
  useLazySearchArticlesQuery,
  useListMyArticlesQuery,
  useListSavedArticlesQuery,
  useLazyListSavedArticlesQuery,
  useGetArticleBySlugQuery,
  useGetArticleEngagementQuery,
  useToggleArticleLikeMutation,
  useToggleArticleSaveMutation,
  useGetArticleCommentsQuery,
  useGetPopularCommentsQuery,
  useCreateArticleCommentMutation,
  useToggleCommentLikeMutation,
  useReportCommentMutation,
  useDeleteArticleCommentMutation,
  useUploadArticleImageMutation,
} = articlesApi;
