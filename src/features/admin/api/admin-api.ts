import { baseApi } from "@/lib/store/api/base-api";
import type {
  AdminUpdateArticlePayload,
  AdminUsersResponse,
  ArticleRequestModerationResponse,
  CommentModerationResponse,
  ModerationArticleRequestItem,
  PlatformStats,
  CreateBanPayload,
  Category,
  ReportsResponse,
  SendAdminEmailPayload,
  SendAdminEmailResponse,
  CreateCategoryPayload,
  ModerationArticle,
  PublishedArticlesResponse,
  ReviewQueueResponse,
  UpdateCategoryPayload,
} from "@/features/admin/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewQueue: builder.query<ReviewQueueResponse, { page?: number } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        return `/admin/articles/review-queue?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Admin", id: "REVIEW_QUEUE" }],
    }),
    approveArticle: builder.mutation<
      { article: ModerationArticle },
      { id: string; categoryIds: string[]; sendEmailNotification?: boolean }
    >({
      query: ({ id, categoryIds, sendEmailNotification }) => ({
        url: `/admin/articles/${id}/approve`,
        method: "POST",
        body: {
          categoryIds,
          ...(sendEmailNotification ? { sendEmailNotification: true } : {}),
        },
      }),
      invalidatesTags: [
        { type: "Admin", id: "REVIEW_QUEUE" },
        { type: "Article", id: "LIST" },
      ],
    }),
    rejectArticle: builder.mutation<
      { article: ModerationArticle },
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/articles/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: [{ type: "Admin", id: "REVIEW_QUEUE" }],
    }),
    listReports: builder.query<
      ReportsResponse,
      { page?: number; status?: string } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        if (params?.status) searchParams.set("status", params.status);
        return `/admin/reports?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Admin", id: "REPORTS" }],
    }),
    dismissReport: builder.mutation<{ report: unknown }, string>({
      query: (id) => ({
        url: `/admin/reports/${id}/dismiss`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Admin", id: "REPORTS" }],
    }),
    getAdminPlatformStats: builder.query<PlatformStats, void>({
      query: () => "/admin/stats",
      providesTags: [{ type: "Admin", id: "STATS" }],
    }),
    listUsers: builder.query<
      AdminUsersResponse,
      { page?: number; search?: string } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        if (params?.search) searchParams.set("search", params.search);
        return `/admin/users?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Admin", id: "USERS" }],
    }),
    banUser: builder.mutation<
      { ban: unknown },
      { id: string; body: CreateBanPayload; reportId?: string }
    >({
      query: ({ id, body, reportId }) => ({
        url: `/admin/users/${id}/ban${reportId ? `?reportId=${encodeURIComponent(reportId)}` : ""}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Admin", id: "USERS" },
        { type: "Admin", id: "REPORTS" },
      ],
    }),
    unbanUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/users/${id}/ban`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Admin", id: "USERS" }],
    }),
    banIp: builder.mutation<
      { ban: unknown },
      { body: CreateBanPayload; reportId?: string }
    >({
      query: ({ body, reportId }) => ({
        url: `/admin/bans/ip${reportId ? `?reportId=${encodeURIComponent(reportId)}` : ""}`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Admin", id: "USERS" },
        { type: "Admin", id: "REPORTS" },
      ],
    }),
    unbanIp: builder.mutation<{ success: boolean }, string>({
      query: (ip) => ({
        url: `/admin/bans/ip/${encodeURIComponent(ip)}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Admin", id: "USERS" }],
    }),
    getPublishedArticles: builder.query<
      PublishedArticlesResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? 50));
        return `/admin/articles/published?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Admin", id: "PUBLISHED" }],
    }),
    getAdminArticle: builder.query<{ article: ModerationArticle }, string>({
      query: (id) => `/admin/articles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Admin", id }],
    }),
    updateAdminArticle: builder.mutation<
      { article: ModerationArticle },
      { id: string; body: AdminUpdateArticlePayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/articles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Admin", id },
        { type: "Admin", id: "REVIEW_QUEUE" },
        { type: "Admin", id: "PUBLISHED" },
        { type: "Article", id: "LIST" },
      ],
    }),
    togglePinArticle: builder.mutation<
      { article: ModerationArticle },
      { id: string; isPinned: boolean }
    >({
      query: ({ id, isPinned }) => ({
        url: `/admin/articles/${id}/pin`,
        method: "PATCH",
        body: { isPinned },
      }),
      invalidatesTags: [
        { type: "Admin", id: "PUBLISHED" },
        { type: "Article", id: "LIST" },
      ],
    }),
    deletePublishedArticle: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `/admin/articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Admin", id: "PUBLISHED" },
        { type: "Article", id: "LIST" },
        { type: "Article", id: "MINE" },
        { type: "Article", id: "SAVED" },
      ],
    }),
    getAdminCategories: builder.query<{ categories: Category[] }, void>({
      query: () => "/admin/categories",
      providesTags: [{ type: "Category", id: "ADMIN_LIST" }],
    }),
    createCategory: builder.mutation<
      { category: Category },
      CreateCategoryPayload
    >({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Category", id: "ADMIN_LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
    updateCategory: builder.mutation<
      { category: Category },
      { id: string; body: UpdateCategoryPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Category", id: "ADMIN_LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Category", id: "ADMIN_LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
    listCommentsForModeration: builder.query<
      CommentModerationResponse,
      {
        page?: number;
        limit?: number;
        status?: "pending" | "approved" | "rejected";
      } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? 50));
        searchParams.set("status", params?.status ?? "pending");
        return `/admin/comments?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Admin", id: "COMMENTS" }],
    }),
    approveComments: builder.mutation<
      { approved: number; commentIds: string[] },
      { commentIds: string[] }
    >({
      query: (body) => ({
        url: "/admin/comments/approve",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Admin", id: "COMMENTS" },
        { type: "Comment" },
        { type: "Article", id: "LIST" },
      ],
    }),
    rejectComments: builder.mutation<
      { rejected: number; commentIds: string[] },
      { commentIds: string[]; reason?: string }
    >({
      query: (body) => ({
        url: "/admin/comments/reject",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Admin", id: "COMMENTS" },
        { type: "Comment" },
      ],
    }),
    deleteCommentsAdmin: builder.mutation<
      { deleted: number; commentIds: string[] },
      { commentIds: string[] }
    >({
      query: (body) => ({
        url: "/admin/comments/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Admin", id: "COMMENTS" },
        { type: "Comment" },
        { type: "Article", id: "LIST" },
      ],
    }),
    listArticleRequestsForModeration: builder.query<
      ArticleRequestModerationResponse,
      {
        page?: number;
        limit?: number;
        status?: "pending" | "approved" | "rejected";
      } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
        searchParams.set("limit", String(params?.limit ?? 20));
        searchParams.set("status", params?.status ?? "pending");
        return `/admin/article-requests?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Admin", id: "ARTICLE_REQUESTS" }],
    }),
    approveArticleRequest: builder.mutation<
      { request: ModerationArticleRequestItem },
      string
    >({
      query: (id) => ({
        url: `/admin/article-requests/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Admin", id: "ARTICLE_REQUESTS" },
        { type: "ArticleRequest", id: "TRENDING" },
        { type: "ArticleRequest", id: "ALL" },
      ],
    }),
    rejectArticleRequest: builder.mutation<
      { request: ModerationArticleRequestItem },
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/article-requests/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: [{ type: "Admin", id: "ARTICLE_REQUESTS" }],
    }),
    sendAdminEmail: builder.mutation<
      SendAdminEmailResponse,
      SendAdminEmailPayload
    >({
      query: (body) => ({
        url: "/admin/emails/send",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetReviewQueueQuery,
  useApproveArticleMutation,
  useRejectArticleMutation,
  useListReportsQuery,
  useDismissReportMutation,
  useGetAdminPlatformStatsQuery,
  useListUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useBanIpMutation,
  useUnbanIpMutation,
  useGetPublishedArticlesQuery,
  useGetAdminArticleQuery,
  useUpdateAdminArticleMutation,
  useTogglePinArticleMutation,
  useDeletePublishedArticleMutation,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useListCommentsForModerationQuery,
  useApproveCommentsMutation,
  useRejectCommentsMutation,
  useDeleteCommentsAdminMutation,
  useListArticleRequestsForModerationQuery,
  useApproveArticleRequestMutation,
  useRejectArticleRequestMutation,
  useSendAdminEmailMutation,
} = adminApi;
