import { baseApi } from "@/lib/store/api/base-api";
import type {
  AdminUpdateArticlePayload,
  AdminUsersResponse,
  CreateBanPayload,
  Category,
  ReportsResponse,
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
      { id: string; categoryIds: string[] }
    >({
      query: ({ id, categoryIds }) => ({
        url: `/admin/articles/${id}/approve`,
        method: "POST",
        body: { categoryIds },
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
      { page?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        searchParams.set("page", String(params?.page ?? 1));
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
  }),
});

export const {
  useGetReviewQueueQuery,
  useApproveArticleMutation,
  useRejectArticleMutation,
  useListReportsQuery,
  useDismissReportMutation,
  useListUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useBanIpMutation,
  useUnbanIpMutation,
  useGetPublishedArticlesQuery,
  useGetAdminArticleQuery,
  useUpdateAdminArticleMutation,
  useTogglePinArticleMutation,
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApi;
